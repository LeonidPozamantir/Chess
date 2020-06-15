const { Router } = require('express');
const router = Router();

router.get('/login', (req, res) => {
    return res.status(200).json({mama: 'myla ramu'});
});

module.exports = router;