export function createWikimediaImage(image, width = 300) {
    return `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(
      image
    )}&width=${width}`;
  }
  