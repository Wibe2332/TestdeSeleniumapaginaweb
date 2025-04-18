const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

async function runTests() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://gestordetareawilberth.netlify.app/');

    console.log("🧪 Test 1: Cargar página");
    await driver.wait(until.titleIs("TaskMaster Web"), 5000);

    console.log("🧪 Test 2: Agregar tarea");
    await driver.findElement(By.id("titulo")).sendKeys("Tarea Selenium");
    await driver.findElement(By.id("descripcion")).sendKeys("Descripción de prueba");
    await driver.findElement(By.id("prioridad")).sendKeys("Alta");
    await driver.findElement(By.id("fecha")).sendKeys("2025-05-01");
    await driver.findElement(By.css("form button[type='submit']")).click();
    await driver.sleep(1000);

    console.log("🧪 Test 3: Verificar tarea en tabla");
    const tarea = await driver.findElements(By.xpath("//td[text()='Tarea Selenium']"));
    console.log(tarea.length > 0 ? "✅ Tarea visible" : "❌ No se encontró la tarea");

    console.log("🧪 Test 4: Completar tarea");
    const btnCompletar = await driver.findElement(By.xpath("//td[text()='Tarea Selenium']/following-sibling::td/button[text()='Completar']"));
    await btnCompletar.click();
    await driver.sleep(500);

    console.log("🧪 Test 5: Editar tarea");
    const btnEditar = await driver.findElement(By.xpath("//td[text()='Tarea Selenium']/following-sibling::td/button[text()='Editar']"));
    await btnEditar.click();
    const tituloInput = await driver.findElement(By.id("titulo"));
    await tituloInput.clear();
    await tituloInput.sendKeys("Tarea Modificada");
    await driver.findElement(By.css("form button[type='submit']")).click();
    await driver.sleep(500);

    console.log("🧪 Test 6: Filtrar por prioridad Alta");
    await driver.findElement(By.id("filtro-prioridad")).sendKeys("Alta");
    await driver.sleep(500);

    console.log("🧪 Test 7: Filtrar por estado Completada");
    await driver.findElement(By.id("filtro-estado")).sendKeys("Completada");
    await driver.sleep(500);

    console.log("🧪 Test 8: Verificar edición");
    const editada = await driver.findElements(By.xpath("//td[text()='Tarea Modificada']"));
    console.log(editada.length > 0 ? "✅ Edición visible" : "❌ No se reflejó la edición");

    console.log("🧪 Test 9: Eliminar tarea");
    const btnEliminar = await driver.findElement(By.xpath("//td[text()='Tarea Modificada']/following-sibling::td/button[text()='Eliminar']"));
    await btnEliminar.click();
    await driver.sleep(500);

    console.log("🧪 Test 10: Confirmar eliminación");
    const eliminada = await driver.findElements(By.xpath("//td[text()='Tarea Modificada']"));
    console.log(eliminada.length === 0 ? "✅ Tarea eliminada" : "❌ La tarea sigue apareciendo");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await driver.quit();
  }
}

runTests();
//Wilberth
//2023-1388