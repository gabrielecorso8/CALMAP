// Funzione per generare la timeline a partire dalla data corrente
function generateTimeline(daysForward = 30, monthsForward = 12, yearsForward = 5) {
  const today = new Date();
  const timeline = {
    days: [],
    months: [],
    years: []
  };
  
  // Genera giorni
  for (let i = 0; i < daysForward; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    timeline.days.push({
      date: formatDate(date),
      label: date.getDate(),
      full: formatDateFull(date)
    });
  }
  
  // Genera mesi
  for (let i = 0; i < monthsForward; i++) {
    const date = new Date();
    date.setMonth(today.getMonth() + i);
    const monthName = date.toLocaleString('it-IT', { month: 'short' });
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!timeline.months.some(m => m.key === key)) {
      timeline.months.push({
        key: key,
        label: monthName,
        month: date.getMonth(),
        year: date.getFullYear(),
        full: date.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
      });
    }
  }
  
  // Genera anni
  for (let i = 0; i < yearsForward; i++) {
    const date = new Date();
    date.setFullYear(today.getFullYear() + i);
    const year = date.getFullYear();
    
    if (!timeline.years.some(y => y.year === year)) {
      timeline.years.push({
        year: year,
        label: year.toString()
      });
    }
  }
  
  return timeline;
}

// Funzione helper per formattare la data come YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Funzione helper per formattare la data in formato leggibile
function formatDateFull(date) {
  return date.toLocaleString('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Funzione per renderizzare la timeline nella UI
function renderTimeline() {
  const timeline = generateTimeline();
  const timelineContainer = document.querySelector('.timeline-container');
  
  // Pulizia del contenitore
  timelineContainer.innerHTML = '';
  
  // Crea sezione giorni
  const daysSection = document.createElement('div');
  daysSection.className = 'timeline-section days';
  daysSection.innerHTML = '<h3>Giorni</h3>';
  
  const daysList = document.createElement('div');
  daysList.className = 'timeline-list';
  
  timeline.days.forEach(day => {
    const dayItem = document.createElement('div');
    dayItem.className = 'timeline-item';
    dayItem.dataset.date = day.date;
    dayItem.textContent = day.label;
    dayItem.title = day.full;
    
    dayItem.addEventListener('click', () => highlightNodesByDate(day.date));
    
    daysList.appendChild(dayItem);
  });
  
  daysSection.appendChild(daysList);
  timelineContainer.appendChild(daysSection);
  
  // Crea sezione mesi (simile a giorni)
  const monthsSection = document.createElement('div');
  monthsSection.className = 'timeline-section months';
  monthsSection.innerHTML = '<h3>Mesi</h3>';
  
  const monthsList = document.createElement('div');
  monthsList.className = 'timeline-list';
  
  timeline.months.forEach(month => {
    const monthItem = document.createElement('div');
    monthItem.className = 'timeline-item';
    monthItem.dataset.month = month.month;
    monthItem.dataset.year = month.year;
    monthItem.dataset.key = month.key;
    monthItem.textContent = month.label;
    monthItem.title = month.full;
    
    monthItem.addEventListener('click', () => highlightNodesByMonth(month.month, month.year));
    
    monthsList.appendChild(monthItem);
  });
  
  monthsSection.appendChild(monthsList);
  timelineContainer.appendChild(monthsSection);
  
  // Crea sezione anni (simile a mesi)
  const yearsSection = document.createElement('div');
  yearsSection.className = 'timeline-section years';
  yearsSection.innerHTML = '<h3>Anni</h3>';
  
  const yearsList = document.createElement('div');
  yearsList.className = 'timeline-list';
  
  timeline.years.forEach(year => {
    const yearItem = document.createElement('div');
    yearItem.className = 'timeline-item';
    yearItem.dataset.year = year.year;
    yearItem.textContent = year.label;
    
    yearItem.addEventListener('click', () => highlightNodesByYear(year.year));
    
    yearsList.appendChild(yearItem);
  });
  
  yearsSection.appendChild(yearsList);
  timelineContainer.appendChild(yearsSection);
}

// Funzione per evidenziare i nodi associati a una data specifica
function highlightNodesByDate(date) {
  // Rimuovi evidenziazione esistente
  document.querySelectorAll('.node-highlight').forEach(node => {
    node.classList.remove('node-highlight');
  });
  
  // Trova tutti i nodi associati alla data e aggiunge la classe per l'evidenziazione neon
  document.querySelectorAll(`.node[data-date="${date}"]`).forEach(node => {
    node.classList.add('node-highlight');
  });
  
  // Aggiorna l'evidenziazione nella timeline
  document.querySelectorAll('.timeline-item.active').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`.timeline-item[data-date="${date}"]`).classList.add('active');
}

// Funzioni analoghe per mese e anno
function highlightNodesByMonth(month, year) {
  // Implementazione simile a highlightNodesByDate
  // ma per i nodi del mese specifico
}

function highlightNodesByYear(year) {
  // Implementazione simile a highlightNodesByDate
  // ma per i nodi dell'anno specifico
}

// Aggiorna la timeline all'avvio e imposta un aggiornamento automatico giornaliero
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
  
  // Aggiorna la timeline ogni giorno a mezzanotte
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const timeUntilMidnight = tomorrow - now;
  
  setTimeout(() => {
    renderTimeline();
    // Imposta aggiornamento quotidiano
    setInterval(renderTimeline, 24 * 60 * 60 * 1000);
  }, timeUntilMidnight);
});
