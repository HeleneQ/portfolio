console.log("PortFolio page loaded successfully!");

// --- GLOBAL CONFIG & DATA ---
const skillCategories = [
    { 
        title: "Programming", 
        list: ["TypeScript", "Python", "C", "Java", "JavaScript", "Matlab", "HTML/CSS","JSON","SQL"] 
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
    const skillsContainer = document.getElementById("skills");
    if (!skillsContainer) return; // Guard clause

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
injectSkills();

// --- THEME TOGGLE (Dark Mode) ---
const themeButton = document.getElementById("theme-toggle");
let isDarkMode = localStorage.getItem("portfolio_theme") === "dark";

// Apply saved theme immediately
if (isDarkMode) {
    document.body.classList.add("dark-mode");
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("portfolio_theme", isDarkMode ? "dark" : "light");
    console.log("Theme: " + (isDarkMode ? "Dark" : "Light"));
}

if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
}

// --- FETCH DATA API DEMO ---
const btnData = document.getElementById('load_data');
const outputData = document.getElementById('output_data');

if (btnData) {
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

// --- CAROUSEL LOGIC ---
const track = document.querySelector('.carousel-track');
const nextButton = document.querySelector('.carousel-btn.next');
const prevButton = document.querySelector('.carousel-btn.prev');

if (track && nextButton && prevButton) {
    const slides = Array.from(track.children);
    let currentIndex = 0;

    const updateCarousel = () => {
        // Calculate width dynamically in case window resized or images just finished loading
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
}

// --- QUICK CONTACT ALERT ---
const contactButton = document.getElementById('contact-btn');
if (contactButton) {
    contactButton.addEventListener('click', () => {
        alert(
            "Contact Hélène Quernet\n\n" +
            "Savonia UAS: helene.quernet@edu.savonia.fi\n" +
            "ESTIA: helene.quernet@etu.estia.fr\n" +
            "GitHub: github.com/HeleneQ"
        );
    });
}

// --- LAST UPDATED FOOTER ---
const lastUpdated = document.createElement("p");
lastUpdated.id = "last-updated";
lastUpdated.style.fontSize = "0.8rem";
lastUpdated.style.marginTop = "1rem";
const formattedDate = new Date().toISOString().split("T")[0];
lastUpdated.textContent = "Last updated: " + formattedDate;
mainElement.appendChild(lastUpdated);