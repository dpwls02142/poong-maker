const sampleImages = [];
const imageCount = 11;
for (let i = 1; i <= imageCount; i++) {
    sampleImages.push(`./assets/img/${i}.png`);
}

const imageSelector = document.getElementById('imageSelector');
const editorSection = document.getElementById('editorSection');
const textInput = document.getElementById('textInput');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const colorPicker = document.getElementById('colorPicker');
const strokeWidthSlider = document.getElementById('strokeWidthSlider');
const strokeWidthValue = document.getElementById('strokeWidthValue');
const strokeColorPicker = document.getElementById('strokeColorPicker');
const bgOpacitySlider = document.getElementById('bgOpacitySlider');
const bgOpacityValue = document.getElementById('bgOpacityValue');
const bgColorPicker = document.getElementById('bgColorPicker');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const addTextBtn = document.getElementById('addTextBtn');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const copyBtn = document.getElementById('copyBtn');

let selectedImage = null;
let captionText = null;
const canvasImage = new Image();

sampleImages.forEach((src, index) => {
    const option = document.createElement('option');
    option.value = src;
    option.textContent = `이미지 ${index + 1}`;
    imageSelector.appendChild(option);
});

imageSelector.addEventListener('change', function() {
    const selectedSrc = this.value;
    if (selectedSrc) {
        selectedImage = selectedSrc;
        loadImageToCanvas(selectedSrc);
        editorSection.style.visibility = 'visible';
    }
});

function selectImage(imgElement, src) {
    const prevSelected = document.querySelector('.image-option.selected');
    if (prevSelected) {
        prevSelected.classList.remove('selected');
    }
    imgElement.classList.add('selected');
    selectedImage = src;
    captionText = null;
    loadImageToCanvas(src);
    editorSection.style.visibility = 'visible';
}

function loadImageToCanvas(src) {
    canvasImage.onload = function() {
        
        canvas.width = canvasImage.width;
        canvas.height = canvasImage.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImage, 0, 0);
        
        if (captionText) {
            drawCaption();
        }
    };
    canvasImage.crossOrigin = "Anonymous";
    canvasImage.src = src;
}
const myFont = new FontFace('BMJUA', 'url(https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff)');
myFont.load().then((font) => {
    document.fonts.add(font);
    // console.log('Font loaded');
  });

// 자막 그리기
function drawCaption() {
    if (!captionText || !canvasImage.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvasImage, 0, 0);
    
    const text = captionText.text;
    const fontSize = captionText.fontSize;
    const fontColor = captionText.color;
    const strokeWidth = captionText.strokeWidth;
    const strokeColor = captionText.strokeColor;
    const bgOpacity = captionText.bgOpacity;
    const bgColor = captionText.bgColor;
    
    myFont.load().then((font) => {
        document.fonts.add(font);
        ctx.font = `${fontSize}px BMJUA`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
    
        // 텍스트 측정
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize;
        
        // 자막 위치 계산 (하단에서 10% 위)
        const x = canvas.width / 2;
        const y = canvas.height - 20;
        
        // 배경 그리기
        if (bgOpacity > 0) {
            const bgColorWithOpacity = hexToRgba(bgColor, bgOpacity / 100);
            const padding = fontSize * 0.3;
            
            ctx.fillStyle = bgColorWithOpacity;
            ctx.fillRect(
                x - textWidth / 2 - padding, 
                y - textHeight - padding / 2, 
                textWidth + padding * 2, 
                textHeight + padding
            );
        }
        
        // 텍스트 외곽선 그리기
        if (strokeWidth > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(text, x, y);
        }
        
        // 텍스트 채우기
        ctx.fillStyle = fontColor;
        ctx.fillText(text, x, y);
    });
}

// HEX 색상을 RGBA로 변환
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

addTextBtn.addEventListener('click', function() {
    if (!selectedImage) return;
    
    const text = textInput.value.trim();
    if (text) {
        captionText = {
            text: text,
            fontSize: parseInt(fontSizeSlider.value),
            color: colorPicker.value,
            strokeWidth: parseInt(strokeWidthSlider.value),
            strokeColor: strokeColorPicker.value,
            bgOpacity: parseInt(bgOpacitySlider.value),
            bgColor: bgColorPicker.value
        };
        drawCaption();
    }
});


// 각 슬라이더 값 표시
let updateTimeout;

function debounceUpdate(fn, delay = 10) {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(fn, delay);
}

fontSizeSlider.addEventListener('input', function() {
    fontSizeValue.textContent = `${this.value}px`;
    debounceUpdate(() => {
        if (captionText) {
            captionText.fontSize = parseInt(this.value);
            drawCaption();
        }
    });
});

strokeWidthSlider.addEventListener('input', function() {
    strokeWidthValue.textContent = `${this.value}px`;
    debounceUpdate(() => {
        if (captionText) {
            captionText.strokeWidth = parseInt(this.value);
            drawCaption();
        }
    });
});

bgOpacitySlider.addEventListener('input', function() {
    bgOpacityValue.textContent = `${this.value}%`;
    debounceUpdate(() => {
        if (captionText) {
            captionText.bgOpacity = parseInt(this.value);
            drawCaption();
        }
    });
});

colorPicker.addEventListener('input', function() {
    debounceUpdate(() => {
        if (captionText) {
            captionText.color = this.value;
            drawCaption();
        }
    });
});

strokeColorPicker.addEventListener('input', function() {
    debounceUpdate(() => {
        if (captionText) {
            captionText.strokeColor = this.value;
            drawCaption();
        }
    });
});

bgColorPicker.addEventListener('input', function() {
    debounceUpdate(() => {
        if (captionText) {
            captionText.bgColor = this.value;
            drawCaption();
        }
    });
});


// 초기화 버튼
resetBtn.addEventListener('click', function() {
    captionText = null;
    textInput.value = '';
    
    // 원본 이미지만 다시 그리기
    if (canvasImage.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImage, 0, 0);
    }
});

// 저장 버튼
saveBtn.addEventListener('click', function() {
    if (!selectedImage) return;
    
    try {
        // 캔버스 내용을 이미지로 변환
        const dataURL = canvas.toDataURL('image/png');
        
        // 다운로드 링크 생성
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'poong.png';
        link.click();
    } catch (e) {
        alert('이미지 저장 중 오류가 발생했습니다: ' + e.message);
    }
});

// 복사 버튼 이벤트
copyBtn.addEventListener('click', function() {
    if (!selectedImage) return;
    
    try {
        // 캔버스 데이터를 클립보드에 복사
        canvas.toBlob(function(blob) {
            try {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(
                    () => alert('이미지가 클립보드에 복사되었습니다.'),
                    (err) => {
                        console.error('클립보드 복사 오류:', err);
                        alert('클립보드 복사에 실패했습니다. 브라우저 권한을 확인해주세요.');
                    }
                );
            } catch (err) {
                alert('이 기능은 최신 브라우저에서만 지원됩니다.');
                console.error('클립보드 복사 오류:', err);
            }
        });
    } catch (e) {
        alert('이미지 복사 중 오류가 발생했습니다: ' + e.message);
    }
});