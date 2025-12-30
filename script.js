// モバイルメニューのトグル
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // メニューリンクをクリックしたらメニューを閉じる
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// スクロール時のヘッダー背景変更
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// スクロールアニメーション（Intersection Observer）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// アニメーション対象の要素を監視
const animateElements = document.querySelectorAll('.feature-card, .blog-card, .event-card, .review-card, .pricing-card, .faq-item, .feature-content, .more-feature-card, .event-item, .blog-item');
animateElements.forEach(el => {
    observer.observe(el);
});

// ヒーローセクションのパララックス効果
const heroBackground = document.querySelector('.hero-background');
if (heroBackground) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    });
}

// CTAセクションのパララックス効果
const ctaBackground = document.querySelector('.cta-background');
if (ctaBackground) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const cta = document.querySelector('.cta');
        if (cta) {
            const ctaTop = cta.getBoundingClientRect().top + window.pageYOffset;
            const windowHeight = window.innerHeight;
            if (scrolled + windowHeight > ctaTop && scrolled < ctaTop + cta.offsetHeight) {
                const parallaxValue = (scrolled - ctaTop) * 0.3;
                ctaBackground.style.transform = `translateY(${parallaxValue}px)`;
            }
        }
    });
}

// 画像の遅延読み込み（Lazy Loading）
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// カードホバー効果の強化
const cards = document.querySelectorAll('.feature-card, .blog-card, .event-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ボタンのクリックエフェクト
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ページ読み込み時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// フォームバリデーション（将来の拡張用）
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
};

// レビューカードスライダー
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');
const indicatorActive = document.getElementById('indicatorActive');
let currentReviewIndex = 0;
const reviewCards = document.querySelectorAll('.review-card');
const totalReviews = reviewCards.length;
const visibleCards = 4; // 一度に表示されるカード数

if (reviewsTrack && reviewPrev && reviewNext && indicatorActive) {
    const updateReviewPosition = () => {
        if (reviewCards.length === 0) return;
        
        const cardWidth = reviewCards[0].offsetWidth;
        const gap = 20; // gap between cards
        const totalCardWidth = cardWidth + gap;
        
        // スライド位置を計算（4枚ずつ表示）
        const maxIndex = Math.max(0, totalReviews - visibleCards);
        const clampedIndex = Math.min(currentReviewIndex, maxIndex);
        
        reviewsTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        reviewsTrack.style.transform = `translateX(-${clampedIndex * totalCardWidth}px)`;
        
        // インジケーター更新（4つのカードグループごとに25%ずつ移動）
        const indicatorWidth = 100 / visibleCards; // 25%
        indicatorActive.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        indicatorActive.style.width = `${indicatorWidth}%`;
        indicatorActive.style.left = `${(clampedIndex % visibleCards) * indicatorWidth}%`;
        
        // ボタンの有効/無効状態を更新
        if (reviewPrev) {
            reviewPrev.style.opacity = clampedIndex === 0 ? '0.4' : '1';
            reviewPrev.style.cursor = clampedIndex === 0 ? 'not-allowed' : 'pointer';
        }
        if (reviewNext) {
            reviewNext.style.opacity = clampedIndex >= maxIndex ? '0.4' : '1';
            reviewNext.style.cursor = clampedIndex >= maxIndex ? 'not-allowed' : 'pointer';
        }
    };

    if (reviewNext) {
        reviewNext.addEventListener('click', () => {
            const maxIndex = Math.max(0, totalReviews - visibleCards);
            if (currentReviewIndex < maxIndex) {
                currentReviewIndex++;
                updateReviewPosition();
            }
        });
    }

    if (reviewPrev) {
        reviewPrev.addEventListener('click', () => {
            if (currentReviewIndex > 0) {
                currentReviewIndex--;
                updateReviewPosition();
            }
        });
    }

    // ウィンドウリサイズ時に再計算
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateReviewPosition();
        }, 250);
    });

    // 初期化
    updateReviewPosition();
}

// FAQアコーディオン
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    const icon = item.querySelector('.faq-icon');

    if (question && answer && toggle) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // すべてのFAQアイテムを閉じる
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-answer').classList.remove('show');
                const faqIcon = faqItem.querySelector('.faq-icon');
                if (faqIcon) {
                    faqIcon.src = 'Assets/Icon/Plus.svg';
                }
            });

            // クリックされたアイテムを開く（閉じていた場合）
            if (!isActive) {
                item.classList.add('active');
                answer.classList.add('show');
                if (icon) {
                    icon.src = 'Assets/Icon/Close.svg';
                }
            }
        });
    }
});

// コンソールメッセージ
console.log('%cLayermate', 'font-size: 24px; font-weight: bold; color: #000;');
console.log('%cデザインを次のレベルへ', 'font-size: 14px; color: #666;');

