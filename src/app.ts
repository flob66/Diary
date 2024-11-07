import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

let tasks: Task[] = [];

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'candice24@ethereal.email',
    pass: 'p93R2qfkwnTRCbwYyM'
  }
});

const sendEmail = (subject: string, text: string): void => {
  const mailOptions = {
    from: 'candice24@ethereal.email',
    to: 'candice24@ethereal.email',
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    // if (error) {
    //   console.log('Erreur d\'envoi de l\'email :', error);
    // } else {
    //   console.log('Email envoyé :', info.response);
    // }
  });
};

app.post('/tasks', (req: Request, res: Response): any => {
  const { title, description }: { title: string; description: string } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Il manque le titre et la description' });
  }

  const newTask: Task = {
    id: tasks.length + 1,
    title,
    description,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);

  sendEmail('Nouvelle Tâche Créée', `La tâche "${title}", id "${newTask.id}", description "${description}" a été créée.`);
});

app.get('/tasks', (req: Request, res: Response): any => {
  res.json(tasks);
  const tasksText: string = JSON.stringify(tasks, null, 2);
  sendEmail('Toutes les tâches', `Voici la liste des tâches :\n\n${tasksText}`);
});

app.get('/tasks/:id', (req: Request, res: Response): any => {
  const taskId: number = parseInt(req.params.id);
  const task: Task | undefined = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }

  res.json(task);
});

app.put('/tasks/:id', (req: Request, res: Response): any => {
  const taskId: number = parseInt(req.params.id);
  const { title, description, completed }: { title?: string; description?: string; completed?: boolean } = req.body;

  const task: Task | undefined = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (typeof completed === 'boolean') task.completed = completed;

  res.json(task);

  sendEmail('Tâche Mise à Jour', `La tâche "${task.title}", id "${task.id}", description "${task.description}" a été mise à jour.`);
});

app.delete('/tasks/:id', (req: Request, res: Response): any => {
  const taskId: number = parseInt(req.params.id);
  const taskIndex: number = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }

  const deletedTask: Task[] = tasks.splice(taskIndex, 1);
  res.json(deletedTask[0]);

  sendEmail('Tâche Supprimée', `La tâche "${deletedTask[0].title}", id "${deletedTask[0].id}", description "${deletedTask[0].description}" a été supprimée.`);
});

export default app;