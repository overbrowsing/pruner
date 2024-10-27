import os
import numpy as np
import matplotlib.pyplot as plt

MIN_TILE_SIZE = 200

def calculate_metrics(viewport_width, tile_width):
  num_columns = viewport_width // tile_width
  width_waste = viewport_width - (num_columns * tile_width)
  return num_columns, width_waste

def generate_viewport_widths(start=500, end=1800, step=100):
  return np.arange(start, end + step, step)

def get_divisors(n):
  return [i for i in range(1, n + 1) if n % i == 0]

def print_metrics(original_breakpoints, best_tile_width, original_width, original_height, num_columns, num_rows, pixel_waste):
  print(f"\nTile calculating complete!")
  print(f"Image dimensions = {original_width} x {original_height}px")
  print(f"Columns = {num_columns}, Rows = {num_rows}")

  total_tiles = num_rows * num_columns
  print(f"Total tiles = {total_tiles}")

  actual_tile_width = original_width / num_columns
  actual_tile_height = original_height / num_rows
  print(f"Tile dimensions = {actual_tile_width:.2f} x {actual_tile_height:.2f}px")
  print(f"Breakpoints = {original_breakpoints}px")
  
  for bp in original_breakpoints:
    cols = (bp + best_tile_width - 1) // best_tile_width
    rows = (original_height + (original_height // num_rows) - 1) // (original_height // num_rows)
    print(f"--- Tiles visible at {bp}px = {cols} (W) {rows} (H)")

def calculate_breakpoint_waste(viewport_width, breakpoints):
  closest_breakpoint = min(breakpoints, key=lambda x: abs(x - viewport_width))
  return max(0, viewport_width - closest_breakpoint)

def save_pixel_waste_to_csv(pixel_wastes, breakpoints):
  directory = os.path.dirname(os.path.abspath(__file__))
  filename = f"{directory}/pixel-waste.csv"
  
  os.makedirs(directory, exist_ok=True)
  
  with open(filename, "w") as file:
    file.write("Viewport Width (px),Tile Waste (px),Breakpoint Waste (px)\n")
    for vp in pixel_wastes.keys():
      tile_waste = pixel_wastes[vp]
      breakpoint_waste = calculate_breakpoint_waste(vp, breakpoints)
      file.write(f"{int(vp)},{tile_waste:.2f},{breakpoint_waste:.2f}\n")
  print(f"Pixel waste data has been saved to {filename}")

def find_best_tile_width(breakpoints, viewport_widths):
  best_tile_width = None
  lowest_average_waste = float('inf')
  pixel_waste_results = {}
  
  for breakpoint in breakpoints:
    suitable_tiles = [d for d in get_divisors(breakpoint) if d >= MIN_TILE_SIZE]
    for tile_width in suitable_tiles:
      pixel_wastes = [calculate_metrics(viewport, tile_width)[1] for viewport in viewport_widths]
      average_waste = np.mean(pixel_wastes)
      pixel_waste_results[tile_width] = average_waste
      
      if average_waste < lowest_average_waste:
        lowest_average_waste = average_waste
        best_tile_width = tile_width
        
  if best_tile_width is None:
    print("No valid tile width found.")
    return 0, 0, {}
  return best_tile_width, lowest_average_waste, pixel_waste_results

def calculate_pixel_waste_for_breakpoints(breakpoints, best_tile_width, original_height, increment=False):
  pixel_waste = {}
  for i in range(len(breakpoints)):
    if increment and i < len(breakpoints) - 1:
      start = breakpoints[i]
      end = breakpoints[i + 1]
      for viewport in range(start, end + 1):
        width_waste = calculate_metrics(viewport, best_tile_width)[1]
        pixel_waste[viewport] = width_waste
    else:
      bp = breakpoints[i]
      num_columns = bp // best_tile_width
      width_waste = bp - (num_columns * best_tile_width)
      height_waste = original_height - (original_height // (original_height // num_columns))
      pixel_waste[bp] = width_waste + height_waste
  return pixel_waste

def main():
  original_width = int(input("Enter the desired largest image width (px): "))
  original_height = int(input("Enter the desired largest image height (px): "))
  
  manual_breakpoints = input("Do you want to manually set breakpoints? (y/n): ").strip().lower()
  if manual_breakpoints == 'y':
    original_breakpoints = list(map(int, input("Enter breakpoints separated by spaces: ").split()))
  else:
    original_breakpoints = [750, 1536, 1860, 2560]
    
  if not original_breakpoints or any(bp <= 0 for bp in original_breakpoints):
    print("Error: Invalid breakpoints provided.")
    return
  
  rounded_breakpoints = original_breakpoints  
  viewport_widths = generate_viewport_widths()
  all_viewport_widths = sorted(set(rounded_breakpoints) | set(viewport_widths))
  
  best_tile_width, average_waste, pixel_waste_results = find_best_tile_width(rounded_breakpoints, all_viewport_widths)
  pixel_waste_breakpoint_values = calculate_pixel_waste_for_breakpoints(rounded_breakpoints, best_tile_width, original_height)
  
  num_columns = original_width // best_tile_width
  num_rows = original_height // (original_height // num_columns)
  
  print_metrics(original_breakpoints, best_tile_width, original_width, original_height, num_columns, num_rows, pixel_waste_results)
  
  export_csv = input("Do you want to export pixel waste data to CSV? (y/n): ").strip().lower()
  if export_csv == 'y':
    pixel_waste_for_csv = calculate_pixel_waste_for_breakpoints(rounded_breakpoints, best_tile_width, original_height, increment=True)
    save_pixel_waste_to_csv(pixel_waste_for_csv, rounded_breakpoints)
  
  show_tiles_graph = input("Do you want to see the graph of tiles? (y/n): ").strip().lower()
  if show_tiles_graph == 'y':
    fig, ax1 = plt.subplots(figsize=(10, 6))
    num_tiles_width = [int(np.ceil(viewport / best_tile_width)) for viewport in all_viewport_widths]
    num_tiles_height = [int(np.ceil(original_height / (original_height // num_columns))) for viewport in all_viewport_widths]
    total_tiles = [w + h for w, h in zip(num_tiles_width, num_tiles_height)]
    
    ax1.step(all_viewport_widths, total_tiles, label='Total Number of Tiles', where='post', color='purple')
    ax1.set_xlabel('Viewport Width (px)')
    ax1.set_ylabel('Total Number of Tiles', color='purple')
    ax1.tick_params(axis='y', labelcolor='purple')
    
    for breakpoint in rounded_breakpoints:
      ax1.axvline(x=breakpoint, color='red', linestyle='--')
      ax1.text(breakpoint, ax1.get_ylim()[1] * 0.95, f'{int(breakpoint)}px', color='red', fontsize=10)
    
    ax1.grid(True)
    ax2 = ax1.twinx()
    pixel_waste_values = [calculate_metrics(vp, best_tile_width)[1] for vp in all_viewport_widths]
    ax2.plot(all_viewport_widths, pixel_waste_values, label='Pixel Waste', color='orange', linestyle='--')
    ax2.axhline(y=average_waste, color='green', linestyle='--', label='Average Wastage')
    ax2.set_ylabel('Pixel Waste (px)', color='orange')
    ax2.tick_params(axis='y', labelcolor='orange')
    
    plt.title('Tile Distribution and Pixel Waste Across Viewports')
    ax1.legend(loc='upper left')
    ax2.legend(loc='upper right')
    plt.grid(True)
    plt.show()

if __name__ == "__main__":
  main()