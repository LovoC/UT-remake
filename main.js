function showSection(sectionId, button) {

    let sections = document.querySelectorAll(".Section");

    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.display = "none";
    });


    let selectedSection = document.getElementById(sectionId);

    if (selectedSection) {

        selectedSection.style.display = "block";

        setTimeout(() => {
            selectedSection.style.opacity = "1";
        }, 10);

    }


    // remove active from all buttons
    let buttons = document.querySelectorAll(".tab-button");

    buttons.forEach(btn => {
        btn.classList.remove("active");
    });


    // add active to clicked button
    if (button) {
        button.classList.add("active");
    }
}


showSection("overview", document.querySelector(".tab-button"));