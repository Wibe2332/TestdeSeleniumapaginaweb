const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs-extra');
const PDFDocument = require('pdfkit');
require('chromedriver');

async function runTests() {
  const driver = await new Builder().forBrowser('chrome').build();
  const screenshotsDir = './screenshots';
  const pdfPath = './reporte_test.pdf';
  const doc = new PDFDocument();

  await fs.ensureDir(screenshotsDir); // Crea la carpeta si no existe
  const pdfStream = fs.createWriteStream(pdfPath);
  doc.pipe(pdfStream);

  const logAndCapture = async (mensaje, nombreArchivo) => {
    console.log(mensaje);
    doc.fontSize(14).text(mensaje);
    const screenshotPath = `${screenshotsDir}/${nombreArchivo}.png`;
    await driver.takeScreenshot().then(
      (image) => fs.writeFileSync(screenshotPath, image, 'base64')
    );
    doc.image(screenshotPath, { width: 400 });
    doc.moveDown();
  };

  try {
    await driver.get('https://gestordetareawilberth.netlify.app/');
    await driver.wait(until.titleIs("TaskMaster Web"), 5000);
    await logAndCapture("🧪 Test 1: Página cargada correctamente", "test1");

    await driver.findElement(By.id("titulo")).sendKeys("Tarea Selenium");
    await driver.findElement(By.id("descripcion")).sendKeys("Descripción de prueba");
    await driver.findElement(By.id("prioridad")).sendKeys("Alta");
    await driver.findElement(By.id("fecha")).sendKeys("2025-05-01");
    await driver.findElement(By.css("form button[type='submit']")).click();
    await driver.sleep(1000);
    await logAndCapture("🧪 Test 2: Tarea agregada", "test2");

    const tarea = await driver.findElements(By.xpath("//td[text()='Tarea Selenium']"));
    await logAndCapture(tarea.length > 0 ? "✅ Tarea visible" : "❌ No se encontró la tarea", "test3");

    const btnCompletar = await driver.findElement(By.xpath("//td[text()='Tarea Selenium']/following-sibling::td/button[text()='Completar']"));
    await btnCompletar.click();
    await driver.sleep(500);
    await logAndCapture("🧪 Test 4: Tarea completada", "test4");

    const btnEditar = await driver.findElement(By.xpath("//td[text()='Tarea Selenium']/following-sibling::td/button[text()='Editar']"));
    await btnEditar.click();
    const tituloInput = await driver.findElement(By.id("titulo"));
    await tituloInput.clear();
    await tituloInput.sendKeys("Tarea Modificada");
    await driver.findElement(By.css("form button[type='submit']")).click();
    await driver.sleep(500);
    await logAndCapture("🧪 Test 5: Tarea editada", "test5");

    await driver.findElement(By.id("filtro-prioridad")).sendKeys("Alta");
    await driver.sleep(500);
    await logAndCapture("🧪 Test 6: Filtro por prioridad 'Alta'", "test6");

    await driver.findElement(By.id("filtro-estado")).sendKeys("Completada");
    await driver.sleep(500);
    await logAndCapture("🧪 Test 7: Filtro por estado 'Completada'", "test7");

    const editada = await driver.findElements(By.xpath("//td[text()='Tarea Modificada']"));
    await logAndCapture(editada.length > 0 ? "✅ Edición visible" : "❌ No se reflejó la edición", "test8");

    const btnEliminar = await driver.findElement(By.xpath("//td[text()='Tarea Modificada']/following-sibling::td/button[text()='Eliminar']"));
    await btnEliminar.click();
    await driver.sleep(500);
    await logAndCapture("🧪 Test 9: Tarea eliminada", "test9");

    const eliminada = await driver.findElements(By.xpath("//td[text()='Tarea Modificada']"));
    await logAndCapture(eliminada.length === 0 ? "✅ Tarea eliminada" : "❌ La tarea sigue apareciendo", "test10");

  } catch (err) {
    console.error("❌ Error:", err.message);
    doc.fontSize(16).fillColor('red').text(`❌ Error: ${err.message}`);
  } finally {
    await driver.quit();
    doc.end();
    console.log(`✅ PDF generado: ${pdfPath}`);
  }
}

runTests();
