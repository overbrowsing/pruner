import os
from PIL import Image

IMAGE_FORMAT = 'WEBP'

def split_image(image, pruner_folder, base_name, grid_size):
    os.makedirs(pruner_folder, exist_ok=True)
    tile_width, tile_height = image.size[0] // grid_size[0], image.size[1] // grid_size[1]
    total_size_kb = 0
    for row in range(grid_size[1]):
        for col in range(grid_size[0]):
            left, upper = col * tile_width, row * tile_height
            tile = image.crop((left, upper, left + tile_width, upper + tile_height))
            tile_name = f"{base_name}-{row * grid_size[0] + col + 1}.{IMAGE_FORMAT.lower()}"
            tile.save(os.path.join(pruner_folder, tile_name), format=IMAGE_FORMAT, quality=80)
            total_size_kb += os.path.getsize(os.path.join(pruner_folder, tile_name)) / 1024
    return grid_size[0] * grid_size[1], total_size_kb, (tile_width, tile_height)

def export_html(pruner_folder, base_name, grid_size):
    tile = f"{grid_size[0]} {grid_size[1]}"
    html_content = f"""<img data-pruner='{{"name": "{base_name}", "tile": "{tile}", "path": "your-path-here/"}}' alt="" loading="lazy">"""
    try:
        with open(os.path.join(pruner_folder, 'data-pruner.html'), 'w') as f:
            f.write(html_content)
        print(f"HTML for {base_name} successfully exported to: {os.path.join(pruner_folder, 'data-pruner.html')}")
    except Exception as e:
        print(f"Error exporting HTML: {e}")

def process_image(input_folder, target_image_name, img_size, grid_size, export_html_choice):
    image_path = os.path.join(input_folder, target_image_name)
    if not os.path.exists(image_path):
        print(f"Image {target_image_name} not found in {input_folder}.")
        return 0, 0, (0, 0)

    img = Image.open(image_path)
    if img_size:
        img = img.resize(img_size)

    pruner_folder = os.path.join(os.getcwd(), 'tools', 'tile-maker', 'processed', os.path.splitext(target_image_name.replace(" ", "-"))[0])
    tile_count, total_size_kb, tile_dimensions = split_image(img, pruner_folder, os.path.splitext(target_image_name)[0], grid_size)

    if tile_count > 0 and export_html_choice:
        export_html(pruner_folder, os.path.splitext(target_image_name)[0], grid_size)

    return tile_count, total_size_kb, tile_dimensions

def get_user_input():
    target_choice = input("Do you want to process all images or just one? (all/one): ").lower()
    if target_choice not in ['all', 'one']:
        print("Invalid choice. Please enter 'all' or 'one'.")
        return None, None, None, None, None

    target_image_name = input("Enter the target image name (with extension): ") if target_choice == 'one' else None
    img_size = None
    if input("Do you want to resize the image before processing (y/n): ").lower() == 'y':
        img_size = (int(input("Width (px): ")), int(input("Height (px): ")))

    columns = int(input("Number of columns: "))
    rows = int(input("Number of rows: "))
    export_html_choice = input("Do you want to export the HTML snippet? (y/n): ").lower() == 'y'

    return target_image_name, img_size, (columns, rows), target_choice, export_html_choice

def print_processing_summary(image_name, tile_count, total_size_kb, grid_size, tile_dimensions):
    print(f"\nProcessing {image_name} complete!")
    print(f"Tiles created = {tile_count}")
    print(f"Total size of tiles = {total_size_kb:.2f} KB")
    print(f"Columns = {grid_size[0]}, Rows = {grid_size[1]}")
    print(f"Tile dimensions = {tile_dimensions[0]} x {tile_dimensions[1]}px")

input_folder = os.path.join(os.getcwd(), 'tools', 'tile-maker', 'target')

target_image_name, img_size, grid_size, target_choice, export_html_choice = get_user_input()
total_tile_count = total_size_kb_all = total_image_count = 0

if target_choice == 'one':
    tile_count, total_size_kb, tile_dimensions = process_image(input_folder, target_image_name, img_size, grid_size, export_html_choice)
    if tile_count > 0:
        print_processing_summary(target_image_name, tile_count, total_size_kb, grid_size, tile_dimensions)
    else:
        print(f"Error: No tiles created for {target_image_name}.")

elif target_choice == 'all':
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            tile_count, total_size_kb, tile_dimensions = process_image(input_folder, filename, img_size, grid_size, export_html_choice)
            if tile_count > 0:
                total_tile_count += tile_count
                total_size_kb_all += total_size_kb
                total_image_count += 1

    if total_image_count > 0:
        average_size_kb = total_size_kb_all / total_image_count
        print("\nProcessing complete for all images!")
        print(f"Total tiles created: {total_tile_count}")
        print(f"Average total size of tiles: {average_size_kb:.2f} KB")
        print(f"Columns: {grid_size[0]}, Rows: {grid_size[1]}")
    else:
        print("Error: No valid images processed.")