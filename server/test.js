const { exec } = require("child_process");
const fs = require("fs");


let pic = "./image.jpg";
let name = "Abhishek adss";
let fname = "S";
let rnum = "7053";
let dob = "17-05-2004";
let mnum = "7046884282";
let addr = "sdfg hjkluyt fgafifjsj dvio andnf ijn89 4fnja v8awnaik";

// exports.makePdf = (pic, name, fname, rnum, dob, mnum, addr) => {
const makePdf = (pic, name, fname, rnum, dob, mnum, addr) => {
  const htmlFilePath = "test.html";
  const pdfOutputPath = "output.pdf";

  //making html dynamic
  let newe = fs.readFileSync("./test.html", "utf-8");

  newe = newe.replace("{name}", name);
  newe = newe.replace("{fname}", fname);
  newe = newe.replace("{rnum}", rnum);
  newe = newe.replace("{dob}", dob);
  newe = newe.replace("{mnum}", mnum);
  newe = newe.replace("{addr}", addr);
  newe = newe.replace("{image}", pic);
  fs.writeFileSync("./new.html", newe);
  
  const command = `wkhtmltopdf --enable-local-file-access new.html ${pdfOutputPath}`;

  console.log('test')
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`PDF generated successfully: ${pdfOutputPath}`);
  });
};


makePdf(pic,name,fname,rnum,dob,mnum,addr)