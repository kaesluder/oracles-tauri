import {
  BaseDirectory,
  FileEntry,
  readDir,
  readTextFile,
} from '@tauri-apps/api/fs';
import { read } from 'fs';

export const listPlugins = async function (
  pluginDir: string,
  baseDir: BaseDirectory
) {
  return await readDir(pluginDir, { dir: baseDir, recursive: false });
};

export const parseFile = async function (filePath: string) {
  const raw = await readTextFile(filePath);
  return JSON.parse(raw);
};

export const loadPluginMeta = async function (dirEntry: FileEntry) {
  const filePath = dirEntry.path + '/meta.json';
  return await parseFile(filePath);
};

export const loadAllPluginMeta = async function (plugins: FileEntry[]) {
  return await Promise.all(plugins.map(loadPluginMeta));
};

export const fullPluginData = async function (dirEntry: FileEntry) {
  const pluginData = await loadPluginMeta(dirEntry);
  const tableList = await readDir(dirEntry.path + '/tables');
  let tableDataRaw = await Promise.all(
    tableList.map(async (x) => {
      return parseFile(x.path);
    })
  );
  pluginData['tables'] = Object.fromEntries(
    tableDataRaw.map((x) => [x.key, x])
  );
  return pluginData;
};
