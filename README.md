# EmployeePayroll

## Development server

```bash
ng serve
```

```json
"build": {
    "builder": "@angular-devkit/build-angular:application",
    "options": {
        "outputPath": "dist/employee-payroll",
        "index": "src/index.html",
        "baseHref": "/",
```


## Production server

```bash
 ng build --configuration=production --output-path=dist --base-href=/EmployeePayrollFullStack/
```

```json
"configurations": {
 "production": {
    "outputPath": "dist",
        "baseHref": "/EmployeePayrollFullStack/",
```
