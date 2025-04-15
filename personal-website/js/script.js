document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', function() {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursor.style.backgroundColor = 'rgba(114, 137, 218, 0.2)';
    });
    
    document.addEventListener('mouseup', function() {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'transparent';
    });
    
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .skill-item, .gallery-item, .timeline-content');
    
    interactiveElements.forEach(function(item) {
        item.addEventListener('mouseover', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.mixBlendMode = 'difference';
            cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.mixBlendMode = 'difference';
            cursor.style.backgroundColor = 'transparent';
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // Random glitch effect for header (gaming/cyberpunk effect)
    const header = document.querySelector('header h1');
    
    setInterval(function() {
        if (Math.random() > 0.95) {
            header.style.textShadow = '2px 2px 0px #ff00ff, -2px -2px 0px #00ffff';
            setTimeout(function() {
                header.style.textShadow = '0 0 10px var(--primary), 0 0 20px var(--primary-dark)';
            }, 200);
        }
    }, 2000);
    
    // Animated skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillSection = document.querySelector('#skills');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        
        // Modified viewport calculation - consider element partially in viewport
        return (
            // Element is at least partially in the viewport
            (rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
             rect.bottom >= 0 &&
             rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
             rect.right >= 0)
        );
    }
    
    function animateSkillBars() {
        if (isInViewport(skillSection)) {
            skillBars.forEach(function(bar) {
                bar.style.width = '0%';
                const finalWidth = bar.classList.contains('expert') ? '95%' : 
                                  bar.classList.contains('advanced') ? '80%' : 
                                  bar.classList.contains('intermediate') ? '65%' : '40%';
                
                setTimeout(function() {
                    bar.style.width = finalWidth;
                }, 200);
            });
            window.removeEventListener('scroll', animateSkillBars);
        }
    }
    
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Initial check

    // Parallax effect for header
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const headerElements = document.querySelector('header .container');
        
        if (scrollPosition < 600) {
            headerElements.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            headerElements.style.opacity = 1 - (scrollPosition / 700);
        }
    });
    
    // Improved timeline animation for all screen sizes
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function animateTimeline() {
        // Check if we're on a mobile device (using CSS media query breakpoint)
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        // For mobile devices, animate all items at once with a staggered delay
        if (isMobile) {
            timelineItems.forEach(function(item, index) {
                setTimeout(function() {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100 * index); // Staggered animation timing
            });
            // Remove scroll listener on mobile after animation is triggered
            window.removeEventListener('scroll', animateTimeline);
        } 
        // For desktop, use normal viewport detection
        else {
            timelineItems.forEach(function(item) {
                if (isInViewport(item)) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }
            });
        }
    }
    
    // Initialize timeline items with appropriate offsets based on screen size
    function initializeTimelineItems() {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        
        timelineItems.forEach(function(item, index) {
            // Different animation initial state for mobile vs desktop
            if (isMobile) {
                item.style.transform = 'translateY(30px)';
            } else {
                if (index % 2 === 0) {
                    item.style.transform = 'translateX(-50px)';
                } else {
                    item.style.transform = 'translateX(50px)';
                }
            }
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }
    
    // Initial setup
    initializeTimelineItems();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateTimeline);
    
    // Initial animation call with slight delay to ensure DOM is fully rendered
    setTimeout(animateTimeline, 500);
    
    // Re-trigger animations on window resize (in case of orientation change)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initializeTimelineItems();
            animateTimeline();
        }, 250);
    });

    // User interaction tracking functionality
    function setupInteractionTracking() {
        // Track page view on initial load
        logInteraction('view', 'page', document.title);
        
        // Track clicks on all elements
        document.addEventListener('click', function(event) {
            // Get the clicked element
            const element = event.target;
            
            // Determine element type
            let elementType = getElementType(element);
            
            // Log the interaction
            logInteraction('click', elementType, getElementIdentifier(element));
        });
        
        // Track visibility of elements using Intersection Observer
        const observerOptions = {
            root: null, // use viewport
            rootMargin: '0px',
            threshold: 0.5 // element is considered viewed when 50% visible
        };
        
        const viewObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element has come into view
                    const elementType = getElementType(entry.target);
                    logInteraction('view', elementType, getElementIdentifier(entry.target));
                    
                    // Unobserve after first view to avoid duplicate logs
                    viewObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe important elements for views
        const elementsToObserve = document.querySelectorAll('section, .gallery-item, .skill-item, .timeline-item, img');
        elementsToObserve.forEach(element => {
            viewObserver.observe(element);
        });
        
        // Helper function to determine element type
        function getElementType(element) {
            // Check for common elements
            if (element.tagName === 'A') return 'link';
            if (element.tagName === 'BUTTON') return 'button';
            if (element.tagName === 'IMG') return 'image';
            if (element.tagName === 'INPUT') {
                return element.type === 'checkbox' ? 'checkbox' : 
                       element.type === 'radio' ? 'radio' :
                       element.type === 'select' ? 'dropdown' : 'input';
            }
            if (element.tagName === 'SELECT') return 'dropdown';
            
            // Check for section types by classes or parent elements
            if (element.closest('.gallery-item')) return 'gallery-item';
            if (element.closest('.skill-item')) return 'skill-item';
            if (element.closest('.timeline-item')) return 'timeline-item';
            if (element.closest('nav')) return 'navigation';
            
            // Check if element is part of a specific section
            const section = element.closest('section');
            if (section) {
                if (section.id) return `section-${section.id}`;
                return 'section';
            }
            
            // Default to the element's tag name
            return element.tagName.toLowerCase();
        }
        
        // Helper function to create an identifier for the element
        function getElementIdentifier(element) {
            // Try to get most descriptive identifier
            if (element.id) return element.id;
            if (element.className) return element.className.split(' ')[0];
            if (element.alt) return element.alt;
            if (element.textContent && element.textContent.trim()) {
                return element.textContent.trim();
            }
            
            return element.tagName.toLowerCase();
        }
        
        // Function to log interactions in the required format
        function logInteraction(eventType, elementType, elementIdentifier) {
            const timestamp = new Date().toISOString();
            console.log(`${timestamp}, ${eventType}, ${elementType}: ${elementIdentifier}`);
        }
    }
    
    // Initialize tracking
    setupInteractionTracking();

    // Text Analysis Functionality
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const basicMetrics = document.getElementById('basic-metrics');
    const pronounsMetrics = document.getElementById('pronouns-metrics');
    const prepositionsMetrics = document.getElementById('prepositions-metrics');
    const articlesMetrics = document.getElementById('articles-metrics');

    // Sample text for demonstration
    const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. I, you, and they walked to the store. He said that she would be there. Its color is beautiful. We can do this ourselves. The cat groomed itself. They did it themselves. The books are theirs, not yours or mine. This is my book, and that is your pencil. One should always do one's best. Each student must complete his or her assignment. Anybody can do this if they try. Someone left their umbrella here. Everyone has their own opinion.

The cat sat on the mat. The dog ran through the park. She climbed over the fence. We walked across the bridge. The bird flew into the tree. He hid under the table. Place it between the books. The picture hangs above the fireplace. The treasure is buried beneath the old oak tree. I'll meet you during lunch. We'll discuss it throughout the meeting. He stood beside her. The child ran towards the playground.

A car drove by. I need an umbrella for the rain. She ate an apple for breakfast. He is an honest man. I saw a movie last night. Can you give me a hand? She's working on a project. 

An elephant never forgets. The teacher gave a homework assignment. I have a great idea. She bought an interesting book. He has an amazing talent. We visited an art gallery. They adopted a puppy. An owl hooted in the night. I'm looking for a new job. She planted an oak tree. He found a dollar on the sidewalk.`;

    // Load sample text when button is clicked
    sampleBtn.addEventListener('click', function() {
        textInput.value = sampleText;
    });

    // Clear the input and results when clear button is clicked
    clearBtn.addEventListener('click', function() {
        textInput.value = '';
        resetResults();
    });

    // Reset all result containers
    function resetResults() {
        basicMetrics.innerHTML = '<p>Enter text and click "Analyze Text" to see results</p>';
        pronounsMetrics.innerHTML = '<p>Enter text and click "Analyze Text" to see results</p>';
        prepositionsMetrics.innerHTML = '<p>Enter text and click "Analyze Text" to see results</p>';
        articlesMetrics.innerHTML = '<p>Enter text and click "Analyze Text" to see results</p>';
    }

    // Analyze text when button is clicked
    analyzeBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (text === '') {
            alert('Please enter text to analyze.');
            return;
        }
        
        // Show loading indicators
        basicMetrics.innerHTML = '<div class="loading-spinner"></div>';
        pronounsMetrics.innerHTML = '<div class="loading-spinner"></div>';
        prepositionsMetrics.innerHTML = '<div class="loading-spinner"></div>';
        articlesMetrics.innerHTML = '<div class="loading-spinner"></div>';
        
        // Use setTimeout to prevent UI freezing for large text
        setTimeout(() => {
            analyzeText(text);
        }, 100);
    });

    // Main text analysis function
    function analyzeText(text) {
        // Basic metrics analysis
        const basicStats = analyzeBasicMetrics(text);
        displayBasicMetrics(basicStats);
        
        // Tokenize text for more complex analysis
        const tokens = tokenizeText(text);
        
        // Pronouns analysis
        const pronounCounts = countPronouns(tokens);
        displayPronounMetrics(pronounCounts);
        
        // Prepositions analysis
        const prepositionCounts = countPrepositions(tokens);
        displayPrepositionMetrics(prepositionCounts);
        
        // Indefinite articles analysis
        const articleCounts = countIndefiniteArticles(tokens);
        displayArticleMetrics(articleCounts);
    }

    // Tokenize text into words
    function tokenizeText(text) {
        // Convert to lowercase and split by spaces and punctuation
        return text.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
            .replace(/\s+/g, ' ')
            .split(' ')
            .filter(word => word.length > 0);
    }

    // Analyze basic metrics: letters, words, spaces, newlines, special symbols
    function analyzeBasicMetrics(text) {
        const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const spaceCount = (text.match(/\s/g) || []).length;
        const newlineCount = (text.match(/\n/g) || []).length;
        const specialSymbolCount = (text.match(/[^\w\s]/g) || []).length;
        
        return {
            letters: letterCount,
            words: wordCount,
            spaces: spaceCount,
            newlines: newlineCount,
            specialSymbols: specialSymbolCount
        };
    }

    // Count pronouns in the tokenized text
    function countPronouns(tokens) {
        const pronouns = {
            personal: ['i', 'me', 'my', 'mine', 'myself', 
                     'you', 'your', 'yours', 'yourself', 'yourselves',
                     'he', 'him', 'his', 'himself', 
                     'she', 'her', 'hers', 'herself',
                     'it', 'its', 'itself',
                     'we', 'us', 'our', 'ours', 'ourselves',
                     'they', 'them', 'their', 'theirs', 'themselves'],
            relative: ['who', 'whom', 'whose', 'which', 'that'],
            interrogative: ['who', 'whom', 'whose', 'which', 'what'],
            demonstrative: ['this', 'that', 'these', 'those'],
            indefinite: ['anybody', 'anyone', 'anything', 'each', 'either', 'everybody', 'everyone', 
                       'everything', 'neither', 'nobody', 'no one', 'nothing', 'one', 'somebody', 
                       'someone', 'something', 'both', 'few', 'many', 'several', 'all', 'any', 
                       'most', 'none', 'some']
        };
        
        const counts = {};
        
        tokens.forEach(token => {
            let found = false;
            
            // Check each pronoun category
            for (const [category, pronounList] of Object.entries(pronouns)) {
                if (pronounList.includes(token)) {
                    if (!counts[token]) {
                        counts[token] = { count: 1, category: category };
                    } else {
                        counts[token].count++;
                    }
                    found = true;
                    break;
                }
            }
        });
        
        return counts;
    }

    // Count prepositions in the tokenized text
    function countPrepositions(tokens) {
        const prepositions = [
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'as', 'at', 
            'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 
            'concerning', 'considering', 'despite', 'down', 'during', 'except', 'for', 'from', 
            'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 
            'past', 'regarding', 'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 
            'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
        ];
        
        const counts = {};
        
        tokens.forEach(token => {
            if (prepositions.includes(token)) {
                if (!counts[token]) {
                    counts[token] = 1;
                } else {
                    counts[token]++;
                }
            }
        });
        
        return counts;
    }

    // Count indefinite articles in the tokenized text
    function countIndefiniteArticles(tokens) {
        const indefiniteArticles = ['a', 'an'];
        
        const counts = {};
        
        tokens.forEach(token => {
            if (indefiniteArticles.includes(token)) {
                if (!counts[token]) {
                    counts[token] = 1;
                } else {
                    counts[token]++;
                }
            }
        });
        
        return counts;
    }

    // Display functions for showing results in the UI
    function displayBasicMetrics(stats) {
        let html = '<div class="metrics-table">';
        html += `<div><strong>Letters:</strong> <span class="count-badge">${stats.letters}</span></div>`;
        html += `<div><strong>Words:</strong> <span class="count-badge">${stats.words}</span></div>`;
        html += `<div><strong>Spaces:</strong> <span class="count-badge">${stats.spaces}</span></div>`;
        html += `<div><strong>Newlines:</strong> <span class="count-badge">${stats.newlines}</span></div>`;
        html += `<div><strong>Special Symbols:</strong> <span class="count-badge">${stats.specialSymbols}</span></div>`;
        html += '</div>';
        
        basicMetrics.innerHTML = html;
    }

    function displayPronounMetrics(pronounCounts) {
        if (Object.keys(pronounCounts).length === 0) {
            pronounsMetrics.innerHTML = '<p>No pronouns found in the text.</p>';
            return;
        }
        
        // Sort by category and count
        const sortedPronouns = Object.entries(pronounCounts)
            .sort((a, b) => {
                // First sort by category
                const categoryComparison = a[1].category.localeCompare(b[1].category);
                if (categoryComparison !== 0) return categoryComparison;
                
                // Then sort by count in descending order
                return b[1].count - a[1].count;
            });
        
        let html = '<table class="metrics-table">';
        html += '<thead><tr><th>Pronoun</th><th>Count</th><th>Category</th></tr></thead><tbody>';
        
        let currentCategory = '';
        sortedPronouns.forEach(([pronoun, data]) => {
            if (data.category !== currentCategory) {
                currentCategory = data.category;
                html += `<tr><td colspan="3" style="background-color: rgba(114, 137, 218, 0.1); color: var(--secondary); text-transform: capitalize; font-weight: bold;">${currentCategory} Pronouns</td></tr>`;
            }
            
            html += `<tr>
                <td>${pronoun}</td>
                <td><span class="count-badge">${data.count}</span></td>
                <td>${data.category}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        pronounsMetrics.innerHTML = html;
    }

    function displayPrepositionMetrics(prepositionCounts) {
        if (Object.keys(prepositionCounts).length === 0) {
            prepositionsMetrics.innerHTML = '<p>No prepositions found in the text.</p>';
            return;
        }
        
        // Sort by count (descending)
        const sortedPrepositions = Object.entries(prepositionCounts)
            .sort((a, b) => b[1] - a[1]);
        
        let html = '<table class="metrics-table">';
        html += '<thead><tr><th>Preposition</th><th>Count</th></tr></thead><tbody>';
        
        sortedPrepositions.forEach(([preposition, count]) => {
            html += `<tr>
                <td>${preposition}</td>
                <td><span class="count-badge">${count}</span></td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        prepositionsMetrics.innerHTML = html;
    }

    function displayArticleMetrics(articleCounts) {
        if (Object.keys(articleCounts).length === 0) {
            articlesMetrics.innerHTML = '<p>No indefinite articles found in the text.</p>';
            return;
        }
        
        // Sort by count (descending)
        const sortedArticles = Object.entries(articleCounts)
            .sort((a, b) => b[1] - a[1]);
        
        let html = '<table class="metrics-table">';
        html += '<thead><tr><th>Indefinite Article</th><th>Count</th></tr></thead><tbody>';
        
        sortedArticles.forEach(([article, count]) => {
            html += `<tr>
                <td>${article}</td>
                <td><span class="count-badge">${count}</span></td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        articlesMetrics.innerHTML = html;
    }
});