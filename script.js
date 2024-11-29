import fluxos from "./fluxos.js";
// Função para renderizar o fluxograma na página especificada
function renderFluxograma(pageId) {

  // Carregar o fluxograma correto baseado na página
  let fluxograma;
  if (pageId === "step1") {
      fluxograma = fluxos.step1
  }

  if (pageId === "step2") {
      fluxograma = fluxos.step2
  }

  if (pageId === "step3") {
      fluxograma = fluxos.step3
  }

  if (pageId === "step4") {
      fluxograma = fluxos.step4
  }

  if (pageId === "step5") {
      fluxograma = fluxos.step5
  }

  if (pageId === "step6") {
      fluxograma = fluxos.step6
  }

  if (pageId === "step7") {
      fluxograma = fluxos.step7
  }

  if (pageId === "step8") {
      fluxograma = fluxos.step8
  }

  if (pageId === "step9") {
      fluxograma = fluxos.step9
  }

  if (pageId === "step10") {
      fluxograma = fluxos.step10
  }
    
  if (!fluxograma) return;
  const g = new dagreD3.graphlib.Graph({ multigraph: true }).setGraph({});

  // Adicionar os nós
  fluxograma.nodes.forEach(node => {
    if (node && node.id && node.label) {
        g.setNode(node.id, { label: node.label, class: node.class || 'type-node' });
    } else {
        console.error("Erro: nó inválido", node);
    }
  });

  // Adicionar as arestas
  fluxograma.edges.forEach(edge => {
    if (edge && edge.from && edge.to) {
      g.setEdge(edge.from, edge.to, { label: edge.label });
    } else {
        console.error("Erro: nó inválido", edge);
    }
  });

  console.log("---------------->", g)

  // Renderiza o grafo no SVG
  const svg = d3.select("svg");
  const inner = svg.append("g");

  const render = new dagreD3.render();
  render(inner, g);

  // Ajusta o tamanho e posicionamento
  svg.attr("height", g.graph().height + 40);
  inner.attr("transform", "translate(20, 20)");
}

// Quando a página carregar, renderiza o fluxograma correspondente
document.addEventListener("DOMContentLoaded", function () {
    const pageId = window.location.pathname.split("/").pop().split(".")[0];
    renderFluxograma(pageId);
});
