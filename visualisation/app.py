import numpy as np
import matplotlib.pyplot as plt

# Configuration
viewport_widths = np.linspace(200, 2000, 100)  # Range of viewport widths (pixels)
viewport_height = 750  # Fixed viewport height (pixels)
cols, rows = 5, 5
tile_width, tile_height = 300, 200  # Tile size (pixels)
mobile_scale = 1.2  # Mobile scale factor (i.e. 1.2 = 120%)
mobile_breakpoint = 768  # Mobile breakpoint (pixels)

# Calculation
def calculate_tiles(viewport_width, scale_factor):
    scaled_tile_width = tile_width * scale_factor
    return np.minimum(np.ceil(viewport_width / scaled_tile_width), cols)
num_tiles_mobile = [calculate_tiles(w, mobile_scale) if w <= mobile_breakpoint else None for w in viewport_widths]
num_tiles_desktop = [calculate_tiles(w, 1) if w > mobile_breakpoint else None for w in viewport_widths]
all_tiles = [t for t in (num_tiles_mobile + num_tiles_desktop) if t is not None]
happy_medium = np.median(all_tiles)
average_tiles = np.mean(all_tiles)
ideal_tiles = np.linspace(min(all_tiles), max(all_tiles), len(viewport_widths))
average_distribution = np.linspace(min(all_tiles), average_tiles + (max(all_tiles) - min(all_tiles)), len(viewport_widths))

# Graph Styling
breakpoint_line_style = ':'
mobile_line_style = '-'
desktop_line_style = '-'
happy_medium_line_style = '--'
average_distribution_line_style = '--'
breakpoint_line_color = '#FF3F26'
mobile_line_color = '#000000'
desktop_line_color = '#000000'
happy_medium_line_color = '#60A22D'
average_distribution_line_color = 'orange'

# Plot Graph
plt.figure(figsize=(10, 6))

plt.plot(viewport_widths, num_tiles_mobile, color=mobile_line_color, linestyle=mobile_line_style)
plt.plot(viewport_widths, num_tiles_desktop, color=desktop_line_color, linestyle=desktop_line_style)
plt.plot(viewport_widths, average_distribution, color=average_distribution_line_color, linestyle=average_distribution_line_style, label='Current Distribution')
plt.plot(viewport_widths, ideal_tiles, color=happy_medium_line_color, linestyle=happy_medium_line_style, label='Target Distribution')
plt.axvline(x=mobile_breakpoint, color=breakpoint_line_color, linestyle=breakpoint_line_style, label='Mobile Breakpoint')
plt.title('Pruner.js Visualisation Tool')
plt.xlabel('Viewport Width (pixels)')
plt.ylabel('Number of Tile Shown')
plt.legend()
plt.grid(True)

# Show Graph
plt.show()