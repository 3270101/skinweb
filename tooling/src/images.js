// Use the matching original photo when an optimized image cannot load.
// Never replace service photos with an unrelated logo or retry indefinitely.
export function recoverImage(image) {
  if(image?.tagName!=='IMG')return false;
  const fallback=image.getAttribute('data-fallback-src');
  if(!fallback?.startsWith('/')||fallback.startsWith('//'))return false;
  if(image.getAttribute('data-image-recovered')===fallback)return false;
  image.setAttribute('data-image-recovered',fallback);
  image.removeAttribute('srcset');
  image.removeAttribute('sizes');
  image.loading='eager';
  image.setAttribute('src',fallback);
  return true;
}

export function checkImages(root=document) {
  for(const image of root.querySelectorAll('img[data-fallback-src]')) {
    // Lazy images that have not started loading are not failures.
    if(image.complete&&image.naturalWidth===0)recoverImage(image);
  }
}

if(typeof document!=='undefined') {
  document.addEventListener('error',event=>recoverImage(event.target),true);
  checkImages();
}
