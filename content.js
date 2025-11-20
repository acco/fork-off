function filterAIImages() {
  document.querySelectorAll('div.card-header > div > img').forEach((el) => {
    if (el.dataset.aiChecked) return;
    el.dataset.aiChecked = 'true';

    const src = el.src;
    const handleMatch = src.match(/filestackcontent\.com\/([^\/\?]+)/);

    if (handleMatch && handleMatch[1]) {
      const handle = handleMatch[1];
      const metadataUrl = `https://cdn.filestackcontent.com/${handle}/metadata`;

      fetch(metadataUrl)
        .then((response) => response.json())
        .then((metadata) => {
          const filename = metadata.filename || '';

          if (filename.startsWith('generation_result')) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';

            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.color = 'white';
            overlay.style.fontSize = '14px';
            overlay.style.fontWeight = 'bold';
            overlay.style.zIndex = '10';
            overlay.style.cursor = 'pointer';
            overlay.textContent = 'AI generated';

            overlay.addEventListener('click', () => {
              overlay.style.display =
                overlay.style.display === 'none' ? 'flex' : 'none';
            });

            el.parentElement.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            wrapper.appendChild(overlay);
          }
        })
        .catch((err) => {
          console.log('Could not fetch metadata for:', src, err);
        });
    }
  });
}

filterAIImages();

const observer = new MutationObserver(() => {
  filterAIImages();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

