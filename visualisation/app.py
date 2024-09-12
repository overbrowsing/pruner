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
num_tiles_mobile = [calculate_tiles(w, viewport_height, mobile_scale) if w <= mobile_breakpoint else None for w in viewport_widths]
num_tiles_desktop = [calculate_tiles(w, viewport_height, 1) if w > mobile_breakpoint else None for w in viewport_widths]
all_tiles = [t for t in (num_tiles_mobile + num_tiles_desktop) if t is not None]
target_distribution = np.median(all_tiles)
average_tiles = np.mean(all_tiles)
ideal_tiles = np.linspace(min(all_tiles), max(all_tiles), len(viewport_widths))
current_distribution = np.linspace(min(all_tiles), average_tiles + (max(all_tiles) - min(all_tiles)), len(viewport_widths))

# Graph Styling
breakpoint_line_style = ':'
mobile_line_style = '-'
desktop_line_style = '-'
target_distribution_line_style = '--'
current_distribution_line_style = '--'
breakpoint_line_color = '#FF3F26'
mobile_line_color = '#000000'
desktop_line_color = '#000000'
target_distribution_line_color = '#60A22D'
current_distribution_line_color = 'orange'

# Plot Graph
plt.figure(figsize=(10, 6))
plt.plot(viewport_widths, num_tiles_mobile, color=mobile_line_color, linestyle=mobile_line_style)
plt.plot(viewport_widths, num_tiles_desktop, color=desktop_line_color, linestyle=desktop_line_style)
plt.plot(viewport_widths, current_distribution, color=current_distribution_line_color, linestyle=current_distribution_line_style, label='Current Distribution')
plt.plot(viewport_widths, ideal_tiles, color=target_distribution_line_color, linestyle=target_distribution_line_style, label='Target Distribution')
plt.axvline(x=mobile_breakpoint, color=breakpoint_line_color, linestyle=breakpoint_line_style, label='Mobile Breakpoint')
plt.title('Pruner.js Visualisation Tool')
plt.xlabel('Viewport Width (pixels)')
plt.ylabel('Number of Tiles Shown (Width x Height)')
plt.legend()
plt.grid(True)

# Show Graph
plt.show()