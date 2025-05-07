#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const moduleName = process.argv[2];

if (!moduleName) {
  console.error("❌ Please provide a module name.");
  process.exit(1);
}

const basePath = path.join(__dirname, "src", "app", "modules", moduleName);
if (fs.existsSync(basePath)) {
  console.error("❌ Module already exists.");
  process.exit(1);
}

fs.mkdirSync(basePath, { recursive: true });

const files = [
  `${moduleName}.interface.ts`,
  `${moduleName}.validation.ts`,
  `${moduleName}.service.ts`,
  `${moduleName}.controller.ts`,
  `${moduleName}.route.ts`,
];

files.forEach((file) => {
  const filePath = path.join(basePath, file);
  fs.writeFileSync(filePath, `// ${file}`, "utf8");
  console.log(`✅ Created: ${filePath}`);
});

console.log(`🎉 Module '${moduleName}' created successfully.`);
