(function () {
  'use strict';

  function init() {
    var dialog = document.getElementById('exhibition-lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') {
      return;
    }

    var imgEl = dialog.querySelector('.exhibition-lightbox__img');
    var capEl = document.getElementById('exhibition-lightbox-caption');
    var panel = dialog.querySelector('.exhibition-lightbox__panel');

    if (!imgEl || !capEl || !panel) {
      return;
    }

    function openFromImg(img) {
      var piece = img.closest('.exhibition-piece');
      var titleEl = piece ? piece.querySelector('.exhibition-piece__title') : null;
      imgEl.src = img.currentSrc || img.src;
      imgEl.alt = img.getAttribute('alt') || '';
      capEl.textContent = titleEl ? titleEl.textContent.trim() : '';
      dialog.showModal();
    }

    document.querySelectorAll('.exhibition-piece__figure img').forEach(function (img) {
      img.setAttribute('tabindex', '0');
      var alt = img.getAttribute('alt') || 'Фото';
      img.setAttribute('aria-label', alt + ' — открыть в полном размере');

      img.addEventListener('click', function () {
        openFromImg(img);
      });

      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFromImg(img);
        }
      });
    });

    dialog.addEventListener('click', function () {
      dialog.close();
    });

    panel.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    var closeBtn = dialog.querySelector('.exhibition-lightbox__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dialog.close();
      });
    }

    dialog.addEventListener('close', function () {
      imgEl.removeAttribute('src');
      imgEl.alt = '';
      capEl.textContent = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
