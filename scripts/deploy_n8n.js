const { spawn } = require('child_process');

const workflow = JSON.parse(require('fs').readFileSync('c:\\Users\\Poneyzada\\Desktop\\Gfteam-Saas\\n8n\\workflows\\catraca_access.json', 'utf8'));

// Adicionando o prefixo [GFTEAM] no nome antes de enviar
workflow.name = "[GFTEAM] Controle de Acesso Catraca";

const mcpPath = 'C:\\Users\\Poneyzada\\AppData\\Roaming\\npm\\node_modules\\n8n-mcp\\dist\\mcp\\index.js';

const child = spawn('node', [mcpPath], {
  env: {
    ...process.env,
    MCP_MODE: "stdio",
    LOG_LEVEL: "error",
    DISABLE_CONSOLE_OUTPUT: "true",
    N8N_API_URL: "https://maestro.fatherflow.com.br/api/v1",
    N8N_BASE_URL: "https://maestro.fatherflow.com.br",
    N8N_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNTNhMzZlNC1iN2MxLTQ0YmEtOTI5YS0zNWUzMjUzZjZlMWUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzczNzAzMzkxfQ.zS5dvXAdZGAKnj90J7lBjcNl7qTVspnXZKAam7wUSN8"
  }
});

const call = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "n8n_create_workflow",
    arguments: workflow
  }
};

child.stdin.write(JSON.stringify(call) + '\n');
child.stdin.end();

child.stdout.on('data', (data) => {
  console.log('OUTPUT:', data.toString());
});

child.stderr.on('data', (data) => {
  console.error('ERROR:', data.toString());
});

child.on('close', (code) => {
  console.log('EXIT CODE:', code);
});
