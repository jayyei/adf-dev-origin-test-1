// fs.readFile('ArmTemplateForFactory.json', (err, data) => {
  //   if (err) throw err
  //   let template = JSON.parse(data)
  //   console.log(template)
  // })
  
var fs = require('fs')
var template = require('./armTemplate/ARMTemplateForFactory.json')

console.log('Reading ARM Template')

var templateWithoutServices = template.resources.filter(
  resource => resource.type !== "Microsoft.DataFactory/factories/linkedServices" 
)

console.log("Removing linked services")
template.resources = templateWithoutServices

var resourcesWithoutDependencies = template.resources.map(resource => {
  let editedResource = resource
  resource.dependsOn.forEach(dependency => {
    if (dependency.search('linkedServices') !== -1) {
      delete editedResource.dependsOn
    }
  });
  return editedResource
})

template.resources = resourcesWithoutDependencies;

console.log("Overriding template")
var jsonToWrite = JSON.stringify(template, null, 2)

fs.writeFile('./armTemplate/ARMTemplateForFactoryNoLSv1.json', jsonToWrite, (err) => {
  if (err) throw err
  console.log('Linked Services were succesfully removed')
})

