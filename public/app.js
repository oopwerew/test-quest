document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('employeesTbody');
  const statusMessage = document.getElementById('statusMessage');
  const tableCard = document.getElementById('tableCard');
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statFired = document.getElementById('statFired');

  function formatDate(isoDateStr) {
    if (!isoDateStr) return '—';
    const parts = String(isoDateStr).slice(0, 10).split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}.${month}.${year}`;
    }
    return String(isoDateStr);
  }

  function formatSalary(amount) {
    const num = Number(amount);
    if (Number.isNaN(num)) return '—';
    return new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 0
    }).format(num) + ' ₽';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showStatus(text, type = 'loading') {
    statusMessage.textContent = text;
    statusMessage.className = `status-box status-box--${type}`;
    statusMessage.hidden = false;
  }

  function hideStatus() {
    statusMessage.hidden = true;
    statusMessage.textContent = '';
  }

  function updateStats(employees) {
    const total = employees.length;
    const fired = employees.filter((e) => Number(e.is_fired) === 1).length;
    const active = total - fired;

    statTotal.textContent = total;
    statActive.textContent = active;
    statFired.textContent = fired;
  }

  function renderTable(employees) {
    tbody.innerHTML = '';

    employees.forEach((emp) => {
      const isFired = Number(emp.is_fired) === 1;
      const tr = document.createElement('tr');
      if (isFired) {
        tr.className = 'row-fired';
      }

      tr.innerHTML = `
        <td class="cell-name">${escapeHtml(emp.full_name)}</td>
        <td class="cell-date num-tabular">${formatDate(emp.birth_date)}</td>
        <td class="cell-passport num-tabular">${escapeHtml(emp.passport)}</td>
        <td class="cell-phone num-tabular">${escapeHtml(emp.phone)}</td>
        <td class="cell-address">${escapeHtml(emp.address)}</td>
        <td class="cell-dept">${escapeHtml(emp.department_name)}</td>
        <td class="cell-pos">${escapeHtml(emp.position_name)}</td>
        <td class="cell-salary num-tabular">${formatSalary(emp.salary)}</td>
        <td class="cell-hire num-tabular">${formatDate(emp.hire_date)}</td>
        <td class="cell-status">
          <span class="badge ${isFired ? 'badge-fired' : 'badge-active'}">
            ${isFired ? 'Уволен' : 'Работает'}
          </span>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  async function loadEmployees() {
    showStatus('Загрузка списка сотрудников...', 'loading');
    tableCard.style.display = 'none';

    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const employees = await response.json();

      updateStats(employees);

      if (!Array.isArray(employees) || employees.length === 0) {
        showStatus('В базе данных пока нет сотрудников.', 'empty');
        tableCard.style.display = 'none';
        return;
      }

      hideStatus();
      renderTable(employees);
      tableCard.style.display = '';
    } catch (err) {
      console.error('Ошибка загрузки сотрудников:', err);
      showStatus('Не удалось загрузить данные сотрудников. Проверьте соединение с сервером.', 'error');
      tableCard.style.display = 'none';
    }
  }

  loadEmployees();
});
