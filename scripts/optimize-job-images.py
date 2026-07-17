from pathlib import Path

from PIL import Image


SOURCE_DIR = Path("public/jobs")
MAX_HEIGHT = 768
QUALITY = 85


def main() -> None:
    for source_path in sorted(SOURCE_DIR.glob("*.png")):
        if source_path.name == "swordman-original.png":
            continue

        with Image.open(source_path) as source:
            source = source.convert("RGBA")
            width, height = source.size
            scale = min(1, MAX_HEIGHT / height)
            resized = source.resize(
                (round(width * scale), round(height * scale)), Image.Resampling.LANCZOS
            )

            destination_path = source_path.with_suffix(".webp")
            resized.save(
                destination_path,
                "WEBP",
                quality=QUALITY,
                method=6,
                alpha_quality=100,
                exact=True,
            )
            print(
                f"{source_path.name}: {width}x{height} -> "
                f"{resized.width}x{resized.height} ({destination_path.name})"
            )


if __name__ == "__main__":
    main()
