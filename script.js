console.log("Portfolio page loaded successfully!");

// --- GLOBAL CONFIG & DATA ---
const skillCategories = [
    { 
        title: "Programming", 
        list: ["TypeScript", "Python", "C", "Java", "JavaScript", "Matlab", "HTML/CSS", "JSON", "SQL", "React"] 
    },
    { 
        title: "Software & Tools", 
        list: ["OnShape (CAD)", "VS Code", "Git/GitHub", "Office 365"] 
    },
    { 
        title: "Professional", 
        list: ["Back-end Development", "Project Management", "Problem Solving", "Technical Research"] 
    }
];

const mainElement = document.getElementById("main");

// --- DYNAMIC SKILLS INJECTION ---
function injectSkills() {
    const skillsContainer = document.getElementById("skills-container");
    if (!skillsContainer) return;

    let html = '<h2 class="section-title">Technical Expertise</h2>';
    html += '<div class="skills-grid-professional">';

    skillCategories.forEach(cat => {
        html += `
            <div class="skill-category-card">
                <h3>${cat.title}</h3>
                <ul class="professional-skills-list">
                    ${cat.list.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    html += '</div>';
    skillsContainer.innerHTML = html;
}

// --- THEME TOGGLE (Dark Mode) ---
function initTheme() {
    const themeButton = document.getElementById("theme-toggle");
    let isDarkMode = localStorage.getItem("portfolio_theme") === "dark";

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
    }

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle("dark-mode", isDarkMode);
            localStorage.setItem("portfolio_theme", isDarkMode ? "dark" : "light");
            console.log("Theme: " + (isDarkMode ? "Dark" : "Light"));
        });
    }
}

// --- FETCH DATA API DEMO ---
function initDataDemo() {
    const btnData = document.getElementById('load_data');
    const outputData = document.getElementById('output_data');

    if (btnData && outputData) {
        btnData.addEventListener("click", async () => {
            outputData.innerHTML = "Loading...";
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
                if (!response.ok) throw new Error("Network response error");
                const data = await response.json();
                outputData.innerHTML = `
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Company:</strong> ${data.company.name}</p>
                `;
            } catch (error) {
                outputData.innerHTML = "Error loading data";
                console.error(error);
            }
        });
    }
}

// --- MULTI-CAROUSEL LOGIC ---
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track ? track.children : []);
        const nextButton = carousel.querySelector('.carousel-btn.next');
        const prevButton = carousel.querySelector('.carousel-btn.prev');

        if (!track || slides.length === 0 || !nextButton || !prevButton) return;

        let currentIndex = 0;

        const updateCarousel = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
    });
}

// --- QUICK CONTACT ALERT ---
function initContactAlert() {
    const contactButton = document.getElementById('contact-btn');
    if (contactButton) {
        contactButton.addEventListener('click', () => {
            alert(
                "Contact Hélène Quernet\n\n" +
                "ESTIA: helene.quernet@etu.estia.fr\n" +
                "Personal: helene.quernet@orange.fr\n" +
                "GitHub: github.com/HeleneQ"
            );
        });
    }
}

// --- LAST UPDATED FOOTER ---
function initFooterDate() {
    if (!mainElement) return;
    const lastUpdated = document.createElement("p");
    lastUpdated.id = "last-updated";
    lastUpdated.style.fontSize = "0.8rem";
    lastUpdated.style.marginTop = "1rem";
    lastUpdated.style.textAlign = "center";
    const formattedDate = new Date().toISOString().split("T")[0];
    lastUpdated.textContent = "Last updated: " + formattedDate;
    mainElement.appendChild(lastUpdated);
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    injectSkills();
    initTheme();
    initDataDemo();
    initCarousels();
    initContactAlert();
    initFooterDate();
});