/*
 * Renders window.ACTIVITIES (assets/js/activities-data.js) into the
 * #activities-grid element on index.html.
 */
(function () {
  function renderActivities() {
    const grid = document.getElementById("activities-grid");
    if (!grid) return;

    if (!window.ACTIVITIES || window.ACTIVITIES.length === 0) {
      grid.innerHTML = '<p class="empty-state">Незабаром тут з’являться нові вправи!</p>';
      return;
    }

    grid.innerHTML = window.ACTIVITIES.map(
      (activity) => `
        <a class="card" href="${activity.path}">
          <h3>${activity.title}</h3>
          <p>${activity.description}</p>
          <div class="card-badges">
            ${activity.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}
          </div>
        </a>
      `
    ).join("");
  }

  document.addEventListener("DOMContentLoaded", renderActivities);
})();
