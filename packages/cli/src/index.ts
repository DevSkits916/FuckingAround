import { promises as fs } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  SignatureProfile,
  renderProfileToTableHtml,
  renderProfileToPng,
  renderStaticPublish,
  deserializeProfiles,
  renderProfileToModernHtml,
} from '@smart-signature/shared';

const readProfile = async (filePath: string): Promise<SignatureProfile[]> => {
  const resolved = resolve(filePath);
  const raw = await fs.readFile(resolved, 'utf8');
  if (filePath.endsWith('.profiles.json')) {
    return deserializeProfiles(raw);
  }
  const profile = JSON.parse(raw) as SignatureProfile;
  return [profile];
};

const writeFileRecursive = async (filePath: string, content: string) => {
  const dir = dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
};

yargs(hideBin(process.argv))
  .scriptName('ssb')
  .command(
    'render',
    'Render HTML/PNG output from a signature JSON file',
    (command) =>
      command
        .option('config', {
          type: 'string',
          demandOption: true,
          describe: 'Path to a signature.json or .profiles.json bundle',
        })
        .option('out', {
          type: 'string',
          describe: 'Output HTML file path (single profile) or directory (bundle)',
        })
        .option('png', {
          type: 'string',
          describe: 'PNG output file (single profile) or directory (bundle)',
        })
        .option('mode', {
          type: 'string',
          choices: ['table', 'modern'] as const,
          default: 'table',
        })
        .option('publish', {
          type: 'boolean',
          default: false,
          describe: 'Generate a static publish bundle (index + profile pages)',
        }),
    async (args) => {
      const profiles = await readProfile(args.config as string);
      if (profiles.length > 1 || args.publish) {
        const result = await renderStaticPublish(profiles);
        const target = args.out ? resolve(args.out as string) : resolve('./dist/signatures');
        await writeFileRecursive(resolve(target, 'index.html'), result.indexHtml);
        await Promise.all(
          Object.entries(result.pages).map(([slug, html]) =>
            writeFileRecursive(resolve(target, slug), html)
          )
        );
        if (args.png) {
          await Promise.all(
            profiles.map(async (profile) => {
              const png = await renderProfileToPng(profile);
              await writeFileRecursive(resolve(args.png as string, `${profile.slug}.png`), png);
            })
          );
        }
        console.log(`Published ${profiles.length} profile(s) to ${target}`);
        return;
      }

      const profile = profiles[0];
      const html = args.mode === 'modern'
        ? renderProfileToModernHtml(profile)
        : renderProfileToTableHtml(profile);
      const htmlPath = args.out ? resolve(args.out as string) : resolve(`${profile.slug}.html`);
      await writeFileRecursive(htmlPath, html);

      if (args.png) {
        const pngData = await renderProfileToPng(profile);
        await writeFileRecursive(resolve(args.png as string), pngData);
      }

      console.log(`Rendered ${profile.name} to ${htmlPath}`);
    }
  )
  .demandCommand(1)
  .help()
  .strict()
  .parse();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const CLI_ROOT = __dirname;
