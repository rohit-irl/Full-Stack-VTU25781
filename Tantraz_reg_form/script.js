document.getElementById("tantrazForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    const data = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        whatsapp: formData.get("whatsapp"),
        department: formData.get("department"),
        year: formData.get("year"),
        gender: formData.get("gender"),
        college: formData.get("college"),
        category: formData.get("category"),
    };

    console.log("Registration Data:", data);

    document.getElementById("successMsg").innerText = "Registered successfully! 🎉";
    this.reset();
});
