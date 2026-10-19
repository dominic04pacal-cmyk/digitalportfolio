const socialLabels = {
    linkedin: "LinkedIn",
    github: "GitHub",
    facebook: "Facebook",
    personalWebsite: "Website",
    other: "More"
};

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text !== undefined && text !== null) {
        element.textContent = text;
    }

    return element;
}

function isSafeLink(value) {
    try {
        const url = new URL(value, window.location.href);
        return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
    } catch {
        return false;
    }
}

function addTextLine(parent, label, value) {
    const line = createElement("p");
    const labelElement = createElement("strong", null, `${label}: `);
    line.append(labelElement, document.createTextNode(value || "To be added"));
    parent.append(line);
}

function renderSkills(skills) {
    const list = document.getElementById("skills-list");
    const groups = [
        ["Core skills", skills.mainSkills],
        ["Technical skills", skills.technicalSkills],
        ["Software & tools", skills.softwareTools],
        ["Soft skills", skills.softSkills]
    ].filter(([, values]) => Array.isArray(values) && values.length > 0);

    list.replaceChildren();

    if (groups.length === 0) {
        list.append(createElement("p", "empty", "Skills will be added here."));
        return;
    }

    groups.forEach(([label, values]) => {
        const group = createElement("div", "skill-group");
        group.append(createElement("h3", null, label));
        const tags = createElement("div", "tag-list");

        values.forEach((skill) => {
            tags.append(createElement("span", "tag", skill));
        });

        group.append(tags);
        list.append(group);
    });

    if (skills.strongestSkill) {
        const group = createElement("div", "skill-group strongest-skill");
        group.append(createElement("h3", null, "Strongest skill"));
        const tags = createElement("div", "tag-list");
        tags.append(createElement("span", "tag", skills.strongestSkill));
        group.append(tags);
        list.append(group);
    }
}

function renderEducation(education) {
    const list = document.getElementById("education-list");
    list.replaceChildren();

    if (!Array.isArray(education) || education.length === 0) {
        list.append(createElement("p", "empty", "Education will be added here."));
        return;
    }

    education.forEach((item) => {
        const entry = createElement("article", "education-entry");
        entry.append(createElement("span", "education-icon", (item.school || "E").charAt(0)));

        const details = createElement("div");
        details.append(createElement("h3", null, item.school || "School to be added"));
        details.append(createElement("p", null, item.degree || "Course to be added"));
        const years = [item.yearStarted, item.graduationYear].filter(Boolean).join(" — ");
        details.append(createElement("span", "year-range", years || "Years to be added"));

        if (Array.isArray(item.certificationsTraining) && item.certificationsTraining.length > 0) {
            const training = createElement("p");
            training.append(createElement("strong", null, "Training: "));
            training.append(document.createTextNode(item.certificationsTraining.join(", ")));
            details.append(training);
        }

        entry.append(details);
        list.append(entry);
    });
}

function renderExperience(experience) {
    const list = document.getElementById("experience-list");
    list.replaceChildren();

    if (!Array.isArray(experience) || experience.length === 0) {
        list.append(createElement("p", "empty", "Work experience will be added here."));
        return;
    }

    experience.forEach((item) => {
        const entry = createElement("article", "content-entry");
        entry.append(createElement("span", "entry-marker"));
        const details = createElement("div");
        details.append(createElement("h3", null, item.position || "Position to be added"));
        addTextLine(details, "Company", item.companyOrganization);

        const date = [item.startDate, item.endDate].filter(Boolean).join(" — ");
        addTextLine(details, "Date", date);

        const responsibilities = Array.isArray(item.responsibilities)
            ? item.responsibilities.filter(Boolean)
            : [];
        const responsibilityText = responsibilities.length > 0
            ? responsibilities.join("; ")
            : "To be added";
        addTextLine(details, "Responsibilities", responsibilityText);

        if (item.whatILearned) {
            addTextLine(details, "What I learned", item.whatILearned);
        }

        entry.append(details);
        list.append(entry);
    });
}

async function screenshotIsAvailable(path) {
    try {
        const screenshotUrl = new URL(path, window.location.href);
        if (screenshotUrl.origin !== window.location.origin) {
            return true;
        }

        const response = await fetch(screenshotUrl, { method: "HEAD" });
        if (response.status === 404) {
            return false;
        }
        if (!response.ok) {
            console.error(`Could not check project screenshot (${response.status}):`, path);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Project screenshot check failed:", error);
        return false;
    }
}

async function renderProjects(projects) {
    const list = document.getElementById("project-list");
    list.replaceChildren();

    if (!Array.isArray(projects) || projects.length === 0) {
        list.append(createElement("p", "empty", "Projects will be added here."));
        return;
    }

    for (const project of projects) {
        const card = createElement("article", "project-card");

        if (project.projectScreenshot && await screenshotIsAvailable(project.projectScreenshot)) {
            const image = createElement("img", "project-image");
            image.src = project.projectScreenshot;
            image.alt = `${project.projectName || "Project"} screenshot`;
            image.onerror = () => {
                image.hidden = true;
            };
            card.append(image);
        }

        const content = createElement("div", "project-content");
        content.append(createElement("h3", null, project.projectName || "Project"));
        if (project.description) {
            content.append(createElement("p", null, project.description));
        }

        if (project.yourRole) {
            content.append(createElement("p", "project-role", `Role: ${project.yourRole}`));
        }

        if (project.problemSolved) {
            content.append(createElement("p", null, `Problem solved: ${project.problemSolved}`));
        }

        const technologies = Array.isArray(project.technologiesToolsUsed)
            ? project.technologiesToolsUsed.filter(Boolean)
            : [];

        if (technologies.length > 0) {
            const tags = createElement("div", "project-tech");
            technologies.forEach((technology) => {
                tags.append(createElement("span", "tag", technology));
            });
            content.append(tags);
        }

        if (project.projectLink && isSafeLink(project.projectLink)) {
            const link = createElement("a", "project-link", "View project ↗");
            link.href = project.projectLink;
            if (/^https?:/i.test(project.projectLink)) {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
            }
            content.append(link);
        }

        card.append(content);
        list.append(card);
    }
}

function renderAchievements(achievements) {
    const list = document.getElementById("achievement-list");
    const certificateGallery = document.getElementById("certificate-gallery");
    const categories = [
        ["Awards", achievements.awards],
        ["Certificates", achievements.certificates],
        ["Competitions", achievements.competitions],
        ["Other achievements", achievements.otherAchievements]
    ];

    list.replaceChildren();
    certificateGallery.replaceChildren();

    categories.forEach(([label, values]) => {
        const items = Array.isArray(values) ? values : [];
        const summary = items.map((item) => {
            if (typeof item === "string") {
                return item;
            }

            return item.title || item.name || item.issuer || "Certificate";
        });
        const item = createElement("div", "achievement-item");
        item.append(createElement("strong", null, label));
        item.append(createElement("span", null, summary.length > 0 ? summary.join(", ") : "To be added"));
        list.append(item);
    });

    const certificates = Array.isArray(achievements.certificates)
        ? achievements.certificates
        : [];

    certificates.forEach((certificate) => {
        if (!certificate || typeof certificate !== "object" || !certificate.image
            || !isSafeLink(certificate.image)) {
            return;
        }

        const title = certificate.title || certificate.name || "Certificate";
        const card = createElement("article", "certificate-card");
        const imageLink = createElement("a", "certificate-image-link");
        imageLink.href = certificate.image;
        imageLink.target = "_blank";
        imageLink.rel = "noopener noreferrer";
        imageLink.setAttribute("aria-label", `Open certificate: ${title}`);

        const image = createElement("img", "certificate-image");
        image.src = certificate.image;
        image.alt = `${certificate.type || "Certificate"}: ${title}`;
        image.onerror = () => {
            image.hidden = true;
        };
        imageLink.append(image);

        const details = createElement("div", "certificate-details");
        details.append(createElement("h3", null, title));
        if (certificate.issuer) {
            details.append(createElement("p", null, certificate.issuer));
        }
        if (certificate.type) {
            details.append(createElement("span", "certificate-type", certificate.type));
        }

        card.append(imageLink, details);
        certificateGallery.append(card);
    });
}

function renderSocialLinks(links, targetIds) {
    const targets = targetIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    targets.forEach((target) => target.replaceChildren());

    Object.entries(socialLabels).forEach(([key, label]) => {
        const href = links[key];
        if (!href || !isSafeLink(href)) {
            return;
        }

        targets.forEach((target) => {
            const link = createElement("a", null, label);
            link.href = href;
            if (/^https?:/i.test(href)) {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
            }
            target.append(link);
        });
    });
}

async function loadPortfolio() {
    try {
        const response = await fetch("data/profile.json");
        if (!response.ok) {
            throw new Error(`Could not load profile data (${response.status}).`);
        }

        const data = await response.json();
        const personal = data.personalInformation || {};
        const about = data.about || {};
        const contact = data.contact || {};
        const links = data.links || {};

        if (personal.preferredName) {
            const name = personal.preferredName.charAt(0).toUpperCase()
                + personal.preferredName.slice(1);
            document.querySelector(".hero-card h1 .accent-text").textContent = `${name}.`;
        }
        if (personal.fullName) {
            document.querySelector(".hero-card h2").textContent = personal.fullName;
        }
        if (personal.professionalTitle) {
            document.querySelector(".profile-card h3").textContent = personal.professionalTitle;
        }
        if (personal.location) {
            document.querySelector(".profile-location").lastChild.textContent = ` ${personal.location}`;
            document.getElementById("contact-location").textContent = personal.location;
        }
        if (personal.profilePhoto) {
            const image = document.querySelector(".profile-image-wrap img");
            image.src = personal.profilePhoto;
        }
        if (about.shortIntroduction) {
            document.querySelector(".lead").textContent = about.shortIntroduction;
        }
        if (about.careerGoals) {
            document.querySelector(".detail-item strong").textContent = about.careerGoals;
        }
        if (data.final && data.final.whyHireYou) {
            document.querySelector(".why-hire p").textContent = data.final.whyHireYou;
        }
        if (data.final && data.final.anythingElse) {
            const extra = createElement("p", null, data.final.anythingElse);
            document.querySelector(".why-hire").append(extra);
        }

        renderSkills(data.skills || {});
        renderEducation(data.education);
        renderExperience(data.workExperience);
        await renderProjects(data.projects);
        renderAchievements(data.achievements || {});

        const email = contact.email || personal.email;
        const phone = contact.phone || personal.contactNumber;
        const preferredMethod = contact.preferredContactMethod || "Email";
        const preferredContact = document.querySelector(".contact-intro");
        preferredContact.replaceChildren(
            document.createTextNode("Preferred contact method: "),
            createElement("strong", null, preferredMethod)
        );

        if (email) {
            const emailLink = document.getElementById("contact-email");
            emailLink.href = `mailto:${email}`;
            emailLink.textContent = email;
        }
        if (phone) {
            const phoneLink = document.getElementById("contact-phone");
            phoneLink.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
            phoneLink.textContent = phone;
        }
        if (contact.otherContactLink && isSafeLink(contact.otherContactLink)) {
            const otherLink = createElement("a", "contact-link", "Other contact");
            otherLink.href = contact.otherContactLink;
            document.querySelector(".contact-details").append(otherLink);
        }

        const resumeFile = data.resume && data.resume.file;
        if (resumeFile) {
            document.getElementById("resume-link").href = resumeFile;
        }

        renderSocialLinks(links, ["social-links", "footer-social-links"]);
    } catch (error) {
        console.error("Portfolio loading error:", error);
    }
}

function enableCardReveal() {
    const cards = document.querySelectorAll(".bento-card");
    cards.forEach((card, index) => {
        card.style.setProperty("--animation-delay", `${Math.min(index * 45, 270)}ms`);
    });

    const revealVisibleCards = () => {
        const viewportHeight = window.innerHeight;
        const visibleCards = [...cards].filter((card) => {
            if (card.classList.contains("reveal-visible")) {
                return false;
            }

            const bounds = card.getBoundingClientRect();
            return bounds.top < viewportHeight && bounds.bottom > 0;
        });

        visibleCards.forEach((card) => card.classList.add("reveal-visible"));
    };

    revealVisibleCards();
    window.addEventListener("scroll", revealVisibleCards, { passive: true });
    window.addEventListener("resize", revealVisibleCards);
}

enableCardReveal();
loadPortfolio();
