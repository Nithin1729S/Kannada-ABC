import os
import cairosvg

def convert_svg_to_png(svg_path, png_path):
    """
    Converts an SVG file to a PNG file with a white background.
    """
    # The background_color parameter sets the background to white
    cairosvg.svg2png(url=svg_path, write_to=png_path, background_color='white')

def main():
    # Loop over all files in the current directory
    for filename in os.listdir('.'):
        # Check if the file ends with .svg (case-insensitive)
        if filename.lower().endswith('.svg'):
            png_filename = os.path.splitext(filename)[0] + '.png'
            convert_svg_to_png(filename, png_filename)
            print(f"Converted {filename} to {png_filename}")

if __name__ == "__main__":
    main()
