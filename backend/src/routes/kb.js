import express from 'express';
import { getKbDocument, listKbDocuments } from '../services/kb.js';

const router = express.Router();

router.get('/documents', async (req, res) => {
  try {
    const documents = await listKbDocuments(req.query.search || '');
    res.json({ documents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:docId', async (req, res) => {
  try {
    const doc = await getKbDocument(req.params.docId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
