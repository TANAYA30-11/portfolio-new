    lucide.createIcons();

    // Mobile navigation
    const menuBtn = document.getElementById("menuBtn");
    const mobilePanel = document.getElementById("mobilePanel");

    function closeMenu() {
      mobilePanel.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.innerHTML = '<i data-lucide="menu"></i>';
      lucide.createIcons();
      document.body.classList.remove("menu-open");
    }

    menuBtn.addEventListener("click", () => {
      const open = mobilePanel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      lucide.createIcons();
      document.body.classList.toggle("menu-open", open);
    });

    mobilePanel.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => { if (window.innerWidth > 1023) closeMenu(); });

    // Reveal-on-scroll
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    // Active navigation
    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...document.querySelectorAll(".nav-links a")];
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => navObserver.observe(section));

    // Synthetic credit-risk simulator
    const loanRange = document.getElementById("loanRange");
    const incomeRange = document.getElementById("incomeRange");
    const scoreRange = document.getElementById("scoreRange");
    const expRange = document.getElementById("expRange");

    function money(value) {
      return "₹" + Number(value).toLocaleString("en-IN");
    }

    function updateRisk() {
      const loan = Number(loanRange.value);
      const income = Number(incomeRange.value);
      const score = Number(scoreRange.value);
      const exp = Number(expRange.value);

      document.getElementById("loanValue").textContent = money(loan);
      document.getElementById("incomeValue").textContent = money(income);
      document.getElementById("scoreValue").textContent = score;
      document.getElementById("expValue").textContent = exp + (exp === 1 ? " year" : " years");

      const ratio = loan / income;
      let risk = 50;
      if (score >= 750) risk -= 25;
      else if (score >= 650) risk -= 10;
      else risk += 20;
      if (ratio < .3) risk -= 15;
      else if (ratio > .8) risk += 25;
      if (exp > 5) risk -= 10;
      risk = Math.min(Math.max(Math.round(risk), 5), 95);

      const ring = document.getElementById("riskRing");
      const badge = document.getElementById("riskBadge");
      const text = document.getElementById("riskText");
      document.getElementById("riskPercent").textContent = risk + "%";

      if (risk < 35) {
        ring.style.borderColor = "#34d399";
        badge.style.color = "#86efac";
        badge.style.background = "rgba(34,197,94,.09)";
        badge.textContent = "LOW RISK · HIGH APPROVAL";
        text.textContent = "Favorable credit rating and income ratio indicate a lower simulated risk.";
      } else if (risk < 65) {
        ring.style.borderColor = "#fbbf24";
        badge.style.color = "#fde68a";
        badge.style.background = "rgba(245,158,11,.09)";
        badge.textContent = "MODERATE RISK · REVIEW";
        text.textContent = "The synthetic score suggests moderate risk and would warrant additional review.";
      } else {
        ring.style.borderColor = "#fb7185";
        badge.style.color = "#fda4af";
        badge.style.background = "rgba(244,63,94,.09)";
        badge.textContent = "HIGH RISK · CAUTION";
        text.textContent = "Lower credit score or higher loan-to-income ratio increases the simulated risk signal.";
      }
    }

    [loanRange, incomeRange, scoreRange, expRange].forEach(input => input.addEventListener("input", updateRisk));
    updateRisk();

    // Static-site contact form: open user's email client
    document.getElementById("contactForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const subject = encodeURIComponent(form.get("subject"));
      const body = encodeURIComponent(
        "Name: " + form.get("name") + "\n" +
        "Email: " + form.get("email") + "\n\n" +
        form.get("message")
      );
      window.location.href = `mailto:tanayakhade11@gmail.com?subject=${subject}&body=${body}`;
    });