'use strict';
import * as vscode from 'vscode';

const DiscordRPC = require("discord-rpc");
const ClientId = '466039114878418944';
DiscordRPC.register(ClientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let langs = ['typescript', 'javascript', 'php', 'css', 'html', 'json'];
let timestamp: number;

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension initialized !');
    timestamp = new Date().getTime() / 1000;
    let cmdActivate = vscode.commands.registerCommand('extension.activateRich', () => {
        
        vscode.window.showInformationMessage('Discord Rich Presence Activated !');
        console.log("Initializing RPC...");
        rpc.login(ClientId).catch(console.error);
        rpc.on('ready', () => {
            console.log("RPC Ready !");
            updateActivity();
        });

        vscode.window.onDidChangeActiveTextEditor(editor => {
            updateActivity();
        });
    });

    let cmdDisable = vscode.commands.registerCommand('extension.disableRich', () => {
        rpc.destroy();
        vscode.window.showInformationMessage('Discord Rich Presence Disabled !');
    });

    context.subscriptions.push(cmdActivate);
    context.subscriptions.push(cmdDisable);
}

export function deactivate() {
    rpc.destroy();
}

function updateActivity() {
    let editor = vscode.window.activeTextEditor;
    if (editor == undefined) {
        rpc.setActivity({
            details: vscode.workspace.name,
            state: "Nenhum arquivo aberto",
            largeImageKey: "undefined",
            largeImageText: "undefined",
            smallImageKey: "logo",
            smallImageText: "Visual Studio Code",
            startTimestamp: timestamp,
            instance: false
        });
        return;
    }
    let fileName = editor.document.fileName;
    let lang: string;
    if (langs.indexOf(editor.document.languageId) == -1) {
        lang = "undefined";
    } else {
        lang = editor.document.languageId;
    }
    rpc.setActivity({
        details: vscode.workspace.name,
        state: "Editando " + fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length),
        largeImageKey: lang,
        largeImageText: lang,
        smallImageKey: 'logo',
        smallImageText: 'Visual Studio Code',
        startTimestamp: timestamp,
        instance: false,
    });
}

