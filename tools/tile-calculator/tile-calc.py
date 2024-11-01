import math
from typing import List, Tuple

def get_priority_viewport_sizes() -> List[Tuple[int, int]]:
  
  return [
    (1920, 1080), (1366, 768), (768, 1024), (412, 915), (360, 800)
  ]

def get_secondary_viewport_sizes() -> List[Tuple[int, int]]:
  return [
    (1536, 864), (390, 844), (393, 873), (414, 896), (1280, 720), (360, 780), (1440, 900), (375, 812), (385, 854), (428, 926), (360, 640), (393, 852), (430, 932), (360, 760), (375, 667), (393, 851)
  ]

def get_divisors(n: int) -> List[int]:
  divisors = set()
  for i in range(1, int(math.sqrt(n)) + 1):
    if n % i == 0:
      divisors.add(i)
      divisors.add(n // i)
  return sorted(divisors)

def calculate_pixel_waste(viewport_width: int, viewport_height: int, tile_width: int, tile_height: int) -> int:
  num_tiles_x = -(-viewport_width // tile_width)
  num_tiles_y = -(-viewport_height // tile_height)

  covered_width = num_tiles_x * tile_width
  covered_height = num_tiles_y * tile_height

  waste_x = max(0, covered_width - viewport_width)
  waste_y = max(0, covered_height - viewport_height)

  return (waste_x * viewport_height) + (waste_y * viewport_width) - (waste_x * waste_y)

def optimal_tile_size(image_width: int, image_height: int, primary_breakpoints: List[Tuple[int, int]], secondary_breakpoints: List[Tuple[int, int]]) -> Tuple[Tuple[int, int], float]:
  density_factor = 2
  all_tile_sizes = {
    (tw, th) for width, height in primary_breakpoints
    for tw in get_divisors(width * density_factor)
    for th in get_divisors(height * density_factor)
    if tw >= 200 and th >= 200
  }

  best_tile_size = None
  min_average_pixel_waste = float('inf')

  for tw, th in all_tile_sizes:
    total_pixel_waste = sum(
      calculate_pixel_waste(width * density_factor, height * density_factor, tw, th) 
      for width, height in primary_breakpoints + secondary_breakpoints
    )
    average_pixel_waste = total_pixel_waste / (len(primary_breakpoints) + len(secondary_breakpoints))

    if average_pixel_waste < min_average_pixel_waste:
      min_average_pixel_waste = average_pixel_waste
      best_tile_size = (tw, th)

  return best_tile_size, min_average_pixel_waste

def calculate_final_pixel_waste(image_width: int, image_height: int, final_tile_width: int, final_tile_height: int, primary_breakpoints: List[Tuple[int, int]], secondary_breakpoints: List[Tuple[int, int]]) -> float:
  total_pixel_waste = sum(
    calculate_pixel_waste(width, height, final_tile_width, final_tile_height)
    for width, height in primary_breakpoints + secondary_breakpoints
  )
  total_viewport_area = sum(width * height for width, height in primary_breakpoints + secondary_breakpoints)
  
  return (total_pixel_waste / total_viewport_area) * 100

def main() -> None:
  image_width = int(input("Enter the desired largest image width (px): "))
  image_height = int(input("Enter the desired largest image height (px): "))

  primary_breakpoints = get_priority_viewport_sizes()
  secondary_breakpoints = get_secondary_viewport_sizes()

  best_tile_size, average_pixel_waste = optimal_tile_size(
    image_width, 
    image_height, 
    primary_breakpoints, 
    secondary_breakpoints
  )

  if best_tile_size:
    tw, th = best_tile_size
    columns = -(-image_width // tw)
    rows = -(-image_height // th)
    total_tiles = columns * rows

    if total_tiles > 100:
      scaling_factor = math.sqrt(total_tiles / 100)
      tw = round(tw / scaling_factor)
      th = round(th / scaling_factor)
      columns = -(-image_width // tw)
      rows = -(-image_height // th)
      total_tiles = columns * rows

    final_tile_width = image_width / columns
    final_tile_height = image_height / rows

    average_pixel_waste_percentage = calculate_final_pixel_waste(
      image_width, 
      image_height, 
      final_tile_width, 
      final_tile_height, 
      primary_breakpoints, 
      secondary_breakpoints
    )

    print("\nTile calculation complete!")
    print(f"Image dimensions = {image_width} x {image_height}px")
    print(f"Columns = {columns}, Rows = {rows}")
    print(f"Total tiles = {total_tiles}")
    print(f"Tile dimensions = {final_tile_width:.2f} x {final_tile_height:.2f}px")
    print(f"Average pixel waste = {average_pixel_waste_percentage:.2f}%")
  else:
    print("No suitable tile size found.")

if __name__ == "__main__":
  main()