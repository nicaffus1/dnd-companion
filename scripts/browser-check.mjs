import {chromium,firefox,webkit} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const url='http://127.0.0.1:4174/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4174'],{stdio:'inherit'});
try{
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch(url)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}assert.ok(ready);
 for(const [name,engine] of Object.entries({chromium,firefox,webkit})){
  const browser=await engine.launch({headless:true});try{const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.getByRole('heading',{name:'Dice Chamber'}).waitFor();await page.getByText('VERSION 2.0.0',{exact:true}).waitFor();await page.getByRole('button',{name:'Roll dice',exact:true}).click();await page.locator('.result strong').waitFor();const total=Number(await page.locator('.result strong').textContent());assert.ok(total>=1&&total<=20);await page.getByRole('button',{name:'Roll history',exact:true}).click();await page.getByText('1 matching entries',{exact:true}).waitFor();await page.getByRole('button',{name:'Done',exact:true}).click();await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('heading',{name:'Install Dice Chamber'}).waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});assert.deepEqual(errors,[]);console.log(name+' release smoke passed');}finally{await browser.close();}
 }
}finally{server.kill();}
