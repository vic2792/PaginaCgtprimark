// Run: node tests/regression.cjs (requires Playwright and Chromium).
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const server=require('node:http').createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(path.join(__dirname,'../index.html')))});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 for(const width of [320,390,1280]){
 const page=await browser.newPage({viewport:{width,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);
 await page.evaluate(()=>document.querySelector('[data-portal="herramientas"]').click());
 assert.equal(await page.locator('#cards button').count(),16);
 for(const id of ['huelga','nomina','horas','vacaciones','permisos','horarios','festivos','escritos','incidencias','derechos','calendario','antiguedad','contratos','test','finiquito','novedades']){
 await page.evaluate(id=>showApp(id),id);assert.equal(await page.locator('#workspace').isVisible(),true,id);
 await page.locator('.back').click();assert.equal(await page.locator('#workspace').isVisible(),false,'back '+id);
 }
 await page.evaluate(()=>{showApp('horas');document.getElementById('full').value='0';calcHoras()});
 assert.match(await page.locator('#result').innerText(),/mayor que cero/);
 await page.evaluate(()=>{document.getElementById('full').value='39.5';calcHoras()});assert.match(await page.locator('#result').innerText(),/1117\.09/);
 await page.evaluate(()=>{goHome();jumpTo('permisos2028')});assert.equal(await page.locator('#permisos2028').isVisible(),true);
 await page.evaluate(()=>document.querySelector('[data-portal="centro"]').click());
 await page.locator('#cgt-letter-name').fill('Prueba <texto>');await page.locator('#cgt-letter-make').click();assert.match(await page.locator('#cgt-letter-output').inputValue(),/Prueba <texto>/);
 await page.locator('#cgt-letter-type').selectOption('renuncia-complementarias');await page.locator('#cgt-letter-make').click();assert.match(await page.locator('#cgt-letter-output').inputValue(),/RENUNCIA AL PACTO/);
 await page.locator('[data-center="jornada"]').click();await page.locator('#cgt-week-calc').click();assert.match(await page.locator('#cgt-week-result').innerText(),/Horas planificadas/);
 await page.evaluate(()=>document.querySelector('[data-portal="nomina"]').click());
 assert.equal(await page.locator('.payroll-group').count(),3);
 await page.locator('#auditHours').fill('30');await page.locator('#auditOther').fill('75');await page.locator('#auditCalc').click();
 assert.match(await page.locator('#auditResult').innerText(),/Total bruto orientativo/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'payroll overflow');
 await page.evaluate(()=>document.querySelector('[data-portal="dudas"]').click());
 for(const [query,expected] of [['Quiero dejar de hacer horas complementarias','Renuncia'],['Cómo quitar las horas complementarias','Renuncia'],['Renunciar al pacto de horas','Renuncia'],['No quiero hacer más horas complementarias','Renuncia'],['Me han despedido y tengo un hijo','Sanciones'],['salario y vacaciones','Necesitamos concretar'],['astronomía','Necesitamos concretar']]){
 await page.locator('#pregunta-staff').fill(query);await page.locator('#form-dudas').evaluate(e=>e.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));assert.match(await page.locator('#respuesta-staff h3').innerText(),new RegExp(expected),query);
 }
 assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${width}px: 16 tools, navigation, calculations, letters, weekly hours, queries`);
 }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
