import os
import subprocess

def convert_png_to_svg_high_sharpness(input_folder):
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(".png"):
            base_name = os.path.splitext(filename)[0]
            input_path = os.path.join(input_folder, filename)
            svg_path = os.path.join(input_folder, base_name + ".svg")
            high_res_path = os.path.join(input_folder, base_name + "_highres.png")
            
            try:
                # Step 1: Create a high-resolution version (600 DPI) for maximum detail.
                subprocess.run([
                    "inkscape",
                    input_path,
                    "--export-type=png",
                    "--export-dpi=600",  # Increase DPI for better detail
                    "--export-filename=" + high_res_path
                ], check=True)
                
                # Step 2: Run Inkscape's trace bitmap action on the high-res PNG.
                # The actions used here are: select all, trace bitmap with default settings, then export as plain SVG.
                actions = f"select-all;trace-bitmap;export-plain-svg:{svg_path};quit"
                subprocess.run([
                    "inkscape",
                    high_res_path,
                    "--actions=" + actions
                ], check=True)
                
                print(f"Converted: {filename} -> {os.path.basename(svg_path)}")
            
            except subprocess.CalledProcessError as e:
                print(f"Failed to convert {filename}: {e}")
            
            # Clean up temporary high-resolution PNG
            if os.path.exists(high_res_path):
                os.remove(high_res_path)

if __name__ == "__main__":
    convert_png_to_svg_high_sharpness(os.getcwd())
