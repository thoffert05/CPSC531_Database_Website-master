import { relative, sep } from 'node:path';

const config = {
  compilerOptions: {
    runes: ({ filename }) => {
      const rel = relative(import.meta.dirname, filename);
      return rel.toLowerCase().split(sep).includes('node_modules') ? undefined : true;
    }
  }
};

export default config;
