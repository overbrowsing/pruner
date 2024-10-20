import os
from PIL import Image

def split_image(image, pruner_folder, base_name, grid_size):
    img_width, img_height = image.size
    tile_width = img_width // grid_size[0]
    tile_height = img_height // grid_size[1]

    os.makedirs(pruner_folder, exist_ok=True)

    tile_count = 0
    total_size_kb = 0

    for row in range(grid_size[1]):
        for col in range(grid_size[0]):
            left = col * tile_width
            upper = row * tile_height
            right = (col + 1) * tile_width
            lower = (row + 1) * tile_height
            
            tile = image.crop((left, upper, right, lower))
            tile_name = f"{base_name}-{row * grid_size[0] + col + 1}.webp"
            tile_path = os.path.join(pruner_folder, tile_name)
            
            tile.save(tile_path, format='WEBP', quality=80)

            tile_size_kb = os.path.getsize(tile_path) / 1024
            total_size_kb += tile_size_kb
            tile_count += 1

    return tile_count, total_size_kb, (tile_width, tile_height)

def export_html(pruner_folder, base_name, grid_size, tile_dimensions):
    html_file_path = os.path.join(pruner_folder, 'data-pruner.html')

    cols, rows = grid_size
    tile_width, tile_height = tile_dimensions

    html_content = f"""<!-- Pruner.js -->

<!-- Just copy the <img> tag below and install the accompanying Pruner.js <script> from the repo into your project. -->
<!-- IMPORTANT! Don't forget to update the 'imagePath' parameter. You'll also need some alt text for your image! -->
<!-- Additionally, if you wish, you can also include the optional parameters as found in the documentation for 'ROI', 'mobileBreak', and 'mobileScale'. -->

<img data-pruner='{{"imageName": "{base_name}", "cols": {cols}, "rows": {rows}, "tileWidth": {tile_width}, "tileHeight": {tile_height}, "imagePath": "/your-path-goes-here"}}' alt="" loading="lazy">"""

    try:
        with open(html_file_path, 'w') as html_file:
            html_file.write(html_content)
        print(f"HTML for {base_name} successfully exported to: {html_file_path}")
    except Exception as e:
        print(f"Error exporting HTML: {e}")

def process_image(input_folder, target_image_name, img_size, grid_size, export_html_choice):
    processed_image_name = target_image_name.replace(" ", "-")
    
    image_path = os.path.join(input_folder, target_image_name)
    
    if not os.path.exists(image_path):
        print(f"Image {target_image_name} not found in {input_folder}.")
        return 0, 0, (0, 0)

    img = Image.open(image_path)

    if img_size:
        img = img.resize(img_size)

    output_folder = os.path.join(os.getcwd(), 'tile-maker', 'processed')
    os.makedirs(output_folder, exist_ok=True)

    pruner_folder = os.path.join(output_folder, os.path.splitext(processed_image_name)[0])
    os.makedirs(pruner_folder, exist_ok=True)

    tile_count, total_size_kb, tile_dimensions = split_image(img, pruner_folder, os.path.splitext(processed_image_name)[0], grid_size)

    if tile_count == 0:
        print(f"Error: No tiles were created for {target_image_name}.")
        return 0, 0, (0, 0)

    if export_html_choice.lower() == 'y':
        export_html(pruner_folder, os.path.splitext(processed_image_name)[0], grid_size, tile_dimensions)

    return tile_count, total_size_kb, tile_dimensions

def get_user_input():
    target_choice = input("Do you want to process all images inside the target folder or just one image? (all/one): ").lower()
    
    if target_choice == 'one':
        target_image_name = input("Enter the name of the target image (with extension, e.g. image.jpg): ")
    elif target_choice == 'all':
        target_image_name = None
    else:
        print("Invalid choice. Please enter 'all' or 'one'.")
        return None, None, None, None, None

    resize_choice = input("Do you want to resize the image before processing (y/n): ").lower()
    
    img_size = None
    if resize_choice == 'y':
        print("Enter the overall size of the image in pixels (width and height): ")
        width = input("Width: ").replace('px', '').strip()
        height = input("Height: ").replace('px', '').strip()
        img_size = (int(width), int(height))

    print("Enter the number of columns and rows to split the image into: ")
    columns = int(input("Number of columns: "))
    rows = int(input("Number of rows: "))

    export_html_choice = input("Do you want to export the HTML snippet? (y/n): ")

    return target_image_name, img_size, (columns, rows), target_choice, export_html_choice

input_folder = os.path.join(os.getcwd(), 'tile-maker', 'target')

target_image_name, img_size, grid_size, target_choice, export_html_choice = get_user_input()

total_tile_count = 0
total_size_kb_all = 0
total_image_count = 0

if target_choice == 'one':
    tile_count, total_size_kb, tile_dimensions = process_image(input_folder, target_image_name, img_size, grid_size, export_html_choice)
    if tile_count > 0:
        total_tile_count += tile_count
        total_size_kb_all += total_size_kb
        tile_width, tile_height = tile_dimensions
        print(f"\nProcessing {target_image_name} complete!")
        print(f"\nTiles created: {tile_count}")
        print(f"Total size of tiles: {total_size_kb:.2f} KB")
        print(f"Columns: {grid_size[0]}, Rows: {grid_size[1]}")
        print(f"Tile dimensions: {tile_width} x {tile_height}px")
    else:
        print(f"Error: No tiles created for {target_image_name}.")
    
elif target_choice == 'all':
    valid_image_count = 0
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            tile_count, total_size_kb, tile_dimensions = process_image(input_folder, filename, img_size, grid_size, export_html_choice)
            if tile_count > 0:
                total_tile_count += tile_count
                total_size_kb_all += total_size_kb
                total_image_count += 1
                valid_image_count += 1
    
    if valid_image_count == 0:
        print("Error: No valid image files were found in the target folder.")
    elif total_tile_count > 0 and total_image_count > 0:
        average_size_kb = total_size_kb_all / total_image_count
        average_tile_width, average_tile_height = tile_dimensions
        print("\nProcessing complete for all images!")
        print(f"\nTotal tiles created: {total_tile_count}")
        print(f"Average total size of tiles: {average_size_kb:.2f} KB")
        print(f"Columns: {grid_size[0]}, Rows: {grid_size[1]}")
        print(f"Tile dimensions: {average_tile_width} x {average_tile_height}px")
    else:
        print("There was an error. No tiles were created.")