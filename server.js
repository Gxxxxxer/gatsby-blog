const express = require('express');
const path = require('path');



const app = express();

app.use(express.static(path.resolve(__dirname, './public')));

const PORT = process.env.PORT || 9000;

app.listen(PORT, function () {
    console.log('listening on port: ' + PORT);
});
