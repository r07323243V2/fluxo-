const fs = require("fs");
const path = require("path");

function generateFlowchart(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf-8");
    const lines = code.split("\n");

    const nodes = [];
    const edges = [];
    let nodeIdCounter = 0;

    // Função para criar IDs únicos
    const createNodeId = () => `Node${nodeIdCounter++}`;

    // Adiciona nó e retorna o ID
    function addNode(label, type = "action", metadata = {}) {
      const id = createNodeId();
      nodes.push({ id, label, type, ...metadata });
      return id;
    }

    // Adiciona aresta entre dois nós
    function addEdge(from, to, label = "") {
      edges.push({ from, to, label });
    }

    // Adiciona nó inicial
    let lastNode = addNode("Início", "start");

    // Processa cada linha do código
    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("import") || trimmed.startsWith("//")) return;

      if (trimmed.startsWith("if")) {
        const conditionNode = addNode(`Condicional: ${trimmed}`, "condition");
        addEdge(lastNode, conditionNode, `Linha ${index + 1}`);
        lastNode = conditionNode;
      } else if (trimmed.startsWith("for") || trimmed.startsWith("while")) {
        const loopNode = addNode(`Laço: ${trimmed}`, "loop");
        addEdge(lastNode, loopNode, `Linha ${index + 1}`);
        lastNode = loopNode;
      } else if (trimmed.startsWith("return") || trimmed.startsWith("throw")) {
        const endNode = addNode(`Fim: ${trimmed}`, "end");
        addEdge(lastNode, endNode, "Encerramento");
        lastNode = endNode;
      } else {
        const actionNode = addNode(`Ação: ${trimmed}`);
        addEdge(lastNode, actionNode, `Linha ${index + 1}`);
        lastNode = actionNode;
      }
    });

    return { nodes, edges };
  } catch (error) {
    console.error("Erro ao gerar fluxograma:", error.message);
    return null;
  }
}

// Script principal
const inputFilePath = process.argv[2];

if (!inputFilePath) {
  console.error("Erro: caminho do arquivo não fornecido. Use: node generateStructuredFlowchart.js <caminho_do_arquivo>");
  process.exit(1);
}

const absolutePath = path.resolve(inputFilePath);
const flowchart = generateFlowchart(absolutePath);

if (flowchart) {
  const outputFile = `${path.basename(inputFilePath, ".js")}_structured_flowchart.json`;
  fs.writeFileSync(outputFile, JSON.stringify(flowchart, null, 2), "utf-8");
  console.log(`Fluxograma gerado com sucesso e salvo em: ${outputFile}`);
}
