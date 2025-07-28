import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "Is Tasky free to use?",
    answer: "Yes! Tasky offers a free plan with core features. Premium plans are also available with advanced functionality.",
  },
  {
    question: "Can I use Tasky on mobile?",
    answer: "Absolutely. Tasky is fully responsive and works seamlessly on smartphones, tablets, and desktops.",
  },
  {
    question: "How secure is my data?",
    answer: "We prioritize your privacy and use industry-standard encryption to protect all your data.",
  },
  {
    question: "Can I collaborate with others?",
    answer: "Yes, Tasky lets you create shared boards and assign tasks to team members.",
  },
];

export const FAQsSection = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#fff" }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          mb={4}
        >
          Everything you need to know about using Tasky.
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};
