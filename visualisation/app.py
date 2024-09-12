import numpy as np
import matplotlib.pyplot as plt

# Configuration
def generate_viewport_widths(start=500, end=1680, num_points=100): # Range of viewport widths (pixels)
    return np.linspace(start, end, num_points)
viewport_widths = generate_viewport_widths()
viewport_height = 750  # Viewport height (pixels)
cols, rows = 5, 5  # Columns and rows
tile_width, tile_height = 300, 200  # Tile size (pixels)
mobile_scale = 1.2  # Mobile scale factor (i.e. 1.2 = 120%)
mobile_breakpoint = 768  # Mobile breakpoint (pixels)

# Calculation
def calculate_tiles(viewport_width, viewport_height, scale_factor):
    scaled_tile_width, scaled_tile_height = tile_width * scale_factor, tile_height * scale_factor
    num_cols = np.minimum(np.ceil(viewport_width / scaled_tile_width), cols)
    num_rows = np.minimum(np.ceil(viewport_height / scaled_tile_height), rows)
    return num_cols * num_rows

image_width = cols * tile_width
image_height = rows * tile_height

def calculate_target_distribution_line(viewport_width, viewport_height, image_width, image_height):
    aspect_ratio_image = image_width / image_height
    aspect_ratio_viewport = viewport_width / viewport_height
    if aspect_ratio_viewport > aspect_ratio_image:
        scale_factor = viewport_width / image_width
        scaled_height = viewport_width / aspect_ratio_image
    else:
        scale_factor = viewport_height / image_height
        scaled_height = viewport_height
    return (viewport_width / tile_width) * (scaled_height / tile_height)

num_tiles_mobile = [calculate_tiles(w, viewport_height, mobile_scale) if w <= mobile_breakpoint else None for w in viewport_widths]
num_tiles_desktop = [calculate_tiles(w, viewport_height, 1) if w > mobile_breakpoint else None for w in viewport_widths]
num_tiles_cover = [calculate_target_distribution_line(w, viewport_height, image_width, image_height) for w in viewport_widths]

all_tiles = [t for t in (num_tiles_mobile + num_tiles_desktop + num_tiles_cover) if t is not None]
average_tiles = np.mean(all_tiles)

current_distribution = np.linspace(min(all_tiles), average_tiles + (max(all_tiles) - min(all_tiles)), len(viewport_widths))

# Graph Styling
breakpoint_line_style = ':'
mobile_line_style = '-'
desktop_line_style = '-'
current_distribution_line_style = '--'
target_distribution_line_style = '-.'
breakpoint_line_color = '#FF3F26'
mobile_line_color = '#000000'
desktop_line_color = '#000000'
current_distribution_line_color = '#FFAE00'
target_distribution_line_color = '#4CAF50'

# Plot Graph
fig, ax1 = plt.subplots(figsize=(10, 6))

# Plot primary y-axis data
ax1.plot(viewport_widths, num_tiles_mobile, color=mobile_line_color, linestyle=mobile_line_style)
ax1.plot(viewport_widths, num_tiles_desktop, color=desktop_line_color, linestyle=desktop_line_style)
ax1.plot(viewport_widths, current_distribution, color=current_distribution_line_color, linestyle=current_distribution_line_style, label='Current Distribution Line')
ax1.plot(viewport_widths, num_tiles_cover, color=target_distribution_line_color, linestyle=target_distribution_line_style, label='Target Distribution Line')
ax1.axvline(x=mobile_breakpoint, color=breakpoint_line_color, linestyle=breakpoint_line_style, label='Mobile Breakpoint')

ax1.set_title('Pruner.js Visualisation Tool')
ax1.set_xlabel('Viewport Width (px)')
ax1.set_ylabel('Number of Tiles Shown (W x H)', color='#FFAE00')
ax1.legend()
ax1.grid(True)
ax2 = ax1.twinx()
ax2.set_ylabel('Single Image Visibility ', color='#4CAF50')

# Show Graph
plt.show()