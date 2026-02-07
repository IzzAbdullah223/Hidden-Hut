import express from 'express';
const app = express();
app.get('/', (req, res) => {
    res.send("Hello world");
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map