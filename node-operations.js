// Presupponiamo che tu stia usando una libreria come Cytoscape.js per la gestione del grafico
// Questo esempio dimostra come implementare le funzionalità 2 e 3 che hai richiesto

// Configurazione iniziale di Cytoscape
document.addEventListener('DOMContentLoaded', () => {
  const cy = cytoscape({
    container: document.getElementById('calmap-container'),
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'background-color': '#121212',
          'color': '#ffffff',
          'text-valign': 'center',
          'text-halign': 'center',
          'border-width': '1px',
          'border-color': '#2a2a2a',
          'shape': 'roundrectangle',
          'width': 'label',
          'height': 'label',
          'padding': '10px'
        }
      },
      {
        selector: 'node.add-button',
        style: {
          'label': '+',
          'background-color': '#333333',
          'width': '30px',
          'height': '30px',
          'font-size': '20px',
          'border-width': '0'
        }
      },
      {
        selector: 'node.highlight',
        style: {
          'border-color': '#ffff00',
          'border-width': '3px',
          'box-shadow': '0 0 15px #ffff00'
        }
      },
      {
        selector: 'node.new-node',
        style: {
          'background-color': '#333333',
          'border-color': '#00ff00',
          'border-width': '2px',
          'box-shadow': '0 0 10px #00ff00'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#555555',
          'target-arrow-color': '#555555',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      },
      {
        selector: 'edge.highlighted',
        style: {
          'line-color': '#ffff00',
          'target-arrow-color': '#ffff00',
          'width': 4,
          'shadow-color': '#ffff00',
          'shadow-blur': '5px',
          'shadow-opacity': 0.8
        }
      }
    ],
    layout: {
      name: 'preset'
    },
    // Abilita interazioni touch per dispositivi mobili
    userZoomingEnabled: true,
    userPanningEnabled: true
  });

  // Carica i dati iniziali del grafico
  loadGraphData(cy);
  
  // Funzione per aggiungere automaticamente i nodi "+" sotto ogni nodo normale
  function addPlusNodesUnderExistingNodes() {
    // Trova tutti i nodi che non sono nodi "+"
    const regularNodes = cy.nodes().filter(node => !node.hasClass('add-button'));
    
    // Per ogni nodo regolare, aggiungi un nodo "+" sotto di esso
    regularNodes.forEach(node => {
      // Verifica se c'è già un nodo "+" per questo nodo
      const existingPlusNode = cy.nodes().filter(n => 
        n.hasClass('add-button') && n.data('parentId') === node.id()
      );
      
      if (existingPlusNode.length === 0) {
        // Calcola la posizione del nodo "+" (sotto il nodo genitore)
        const position = {
          x: node.position('x'),
          y: node.position('y') + node.height() + 40
        };
        
        // Crea il nodo "+"
        const plusNode = cy.add({
          group: 'nodes',
          data: { 
            label: '+',
            parentId: node.id()
          },
          position: position,
          classes: 'add-button'
        });
        
        // Aggiungi listener per la creazione di nuovi nodi
        plusNode.on('tap', function(evt) {
          createNewChildNode(node, plusNode);
        });
      }
    });
  }
  
  // Funzione per creare un nuovo nodo figlio
  function createNewChildNode(parentNode, plusNode) {
    // Genera un ID unico per il nuovo nodo
    const newNodeId = 'node-' + Date.now();
    
    // Calcola la posizione per il nuovo nodo
    const newNodePosition = {
      x: plusNode.position('x'),
      y: plusNode.position('y') + 60
    };
    
    // Crea il nuovo nodo
    const newNode = cy.add({
      group: 'nodes',
      data: { 
        id: newNodeId,
        label: 'Nuovo Nodo',
        date: getCurrentDate() // Assegna data corrente al nuovo nodo
      },
      position: newNodePosition,
      classes: 'new-node'
    });
    
    // Crea un edge dal nodo genitore al nuovo nodo
    cy.add({
      group: 'edges',
      data: {
        source: parentNode.id(),
        target: newNodeId
      }
    });
    
    // Riposiziona il nodo "+" sotto il nuovo nodo
    plusNode.position({
      x: newNodePosition.x,
      y: newNodePosition.y + newNode.height() + 40
    });
    
    // Aggiorna il parentId del plusNode
    plusNode.data('parentId', newNodeId);
    
    // Aggiungi un nuovo nodo "+" sotto il nodo genitore originale
    addPlusNodesUnderExistingNodes();
    
    // Ridisegna il layout se necessario
    adjustLayout();
    
    // Opzionale: inizia l'editing del nodo
    startNodeEditing(newNode);
  }
  
  // Funzione per il supporto alla creazione di bivi
  function setupEdgeBifurcations() {
    // Aggiungi listener per il tap sugli edge
    cy.on('tap', 'edge', function(evt) {
      const edge = evt.target;
      const sourceNode = edge.source();
      
      // Calcola la posizione per il nuovo nodo di biforcazione
      // Lo mettiamo a lato dell'edge esistente
      const sourcePos = sourceNode.position();
      const targetPos = edge.target().position();
      
      const midX = (sourcePos.x + targetPos.x) / 2;
      const midY = (sourcePos.y + targetPos.y) / 2;
      
      // Sposta leggermente verso destra per creare una biforcazione visiva
      const bifurcationPos = {
        x: midX + 100,
        y: midY
      };
      
      // Crea il nuovo nodo di biforcazione
      const newBifId = 'bif-' + Date.now();
      const bifurcationNode = cy.add({
        group: 'nodes',
        data: { 
          id: newBifId,
          label: 'Alternativa',
          date: getCurrentDate()
        },
        position: bifurcationPos,
        classes: 'new-node'
      });
      
      // Crea un edge dal nodo sorgente al nuovo nodo di biforcazione
      cy.add({
        group: 'edges',
        data: {
          source: sourceNode.id(),
          target: newBifId
        }
      });
      
      // Aggiungi un nodo "+" sotto il nuovo nodo di biforcazione
      addPlusNodesUnderExistingNodes();
      
      // Ridisegna il layout se necessario
      adjustLayout();
      
      // Opzionale: inizia l'editing del nodo
      startNodeEditing(bifurcationNode);
    });
  }
  
  // Gestione del drag & drop dei nodi
  function setupDragAndDrop() {
    cy.on('dragfree', 'node', function(evt) {
      const node = evt.target;
      
      // Se è un nodo regolare (non un nodo "+")
      if (!node.hasClass('add-button')) {
        // Aggiorna la posizione dei nodi "+" collegati
        updatePlusNodesPositions(node);
      }
      
      // Salvare la nuova posizione nel database o in localStorage
      saveNodePosition(node);
    });
  }
  
  // Funzione per aggiornare le posizioni dei nodi "+" dopo lo spostamento
  function updatePlusNodesPositions(movedNode) {
    // Trova il nodo "+" associato a questo nodo
    const plusNode = cy.nodes().filter(n => 
      n.hasClass('add-button') && n.data('parentId') === movedNode.id()
    );
    
    if (plusNode.length > 0) {
      plusNode.position({
        x: movedNode.position('x'),
        y: movedNode.position('y') + movedNode.height() + 40
      });
    }
    
    // Aggiorna anche le posizioni degli altri nodi collegati se necessario
    // Questo dipende dalla logica del tuo layout
  }
  
  // Funzione helper per ottenere la data corrente nel formato richiesto
  function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }
  
  // Funzione per l'editing di un nodo (mostra un form o dialog per modificare le proprietà)
  function startNodeEditing(node) {
    // Implementazione dell'interfaccia di editing
    // Potresti mostrare un popup o un form inline
    
    // Esempio: mostra un dialog semplice
    const label = prompt('Nome del nodo:', node.data('label'));
    if (label) {
      node.data('label', label);
    }
    
    const dateStr = prompt('Data del nodo (YYYY-MM-DD):', node.data('date'));
    if (dateStr && isValidDate(dateStr)) {
      node.data('date', dateStr);
      
      // Evidenzia il nodo se corrisponde alla data attualmente selezionata
      const selectedDate = document.querySelector('.timeline-item.active')?.dataset.date;
      if (selectedDate && dateStr === selectedDate) {
        node.addClass('highlight');
      }
    }
  }
  
  // Verifica validità data
  function isValidDate(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  }
  
  // Aggiusta il layout dopo modifiche
  function adjustLayout() {
    // Implementazione dipende dal tipo di layout che stai usando
    // Se stai usando un layout automatico, potresti voler chiamare cy.layout({...}).run()
    // Se stai gestendo manualmente le posizioni, potresti dover fare altre operazioni
  }
  
  // Salva la posizione del nodo (localStorage, DB, etc.)
  function saveNodePosition(node) {
    // Implementazione dipende da come stai persistendo i dati
    // Esempio con localStorage
    const graphData = JSON.parse(localStorage.getItem('calmapData') || '{"nodes":[], "edges":[]}');
    
    // Trova e aggiorna il nodo nei dati salvati
    const nodeIndex = graphData.nodes.findIndex(n => n.data.id === node.id());
    if (nodeIndex >= 0) {
      graphData.nodes[nodeIndex].position = {
        x: node.position('x'),
        y: node.position('y')
      };
      localStorage.setItem('calmapData', JSON.stringify(graphData));
    }
  }
  
  // Carica i dati del grafico da localStorage o dal server
  function loadGraphData(cy) {
    // Implementazione dipende da come stai persistendo i dati
    // Esempio con localStorage
    const savedData = localStorage.getItem('calmapData');
    if (savedData) {
      const graphData = JSON.parse(savedData);
      cy.json({ elements: graphData });
    } else {
      // Crea un nodo iniziale se non ci sono dati
      cy.add({
        group: 'nodes',
        data: { 
          id: 'start', 
          label: 'Inizio Progetto',
          date: getCurrentDate()
        },
        position: { x: 300, y: 100 }
      });
    }
    
    // Aggiungi nodi "+" a tutti i nodi esistenti
    addPlusNodesUnderExistingNodes();
  }
  
  // Inizializza tutte le funzionalità
  addPlusNodesUnderExistingNodes();
  setupEdgeBifurcations();
  setupDragAndDrop();
});
