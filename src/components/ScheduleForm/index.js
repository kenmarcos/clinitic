import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../Input";
import { Container, Form, Title } from "./styles";
import Button from "../Button";
import { useAppointment } from "../../providers/appointment";
import toast from "react-hot-toast";

const ScheduleForm = ({ setIsOpenModal, isOpenModal }) => {
  const { createAppointment } = useAppointment();

  const schema = yup.object().shape({
    title: yup.string().required("Campo obrigatório"),
    start: yup.string().required("Campo obrigatório"),
    end: yup.string().required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleForm = (data) => {
    const datetime1 = data.start;
    const datetime2 = data.end;
    if (datetime2 < datetime1) {
      return toast.error(
        "Data e horário finais não podem ser antes da data e horáro iniciais."
      );
    }

    if (datetime1 < new Date() || datetime2 < new Date()) {
      return toast.error("A data escolhida já passou.");
    }

    const patientId = JSON.parse(localStorage.getItem("@clinitic:patientId"));
    const token = JSON.parse(localStorage.getItem("@clinitic:token"));
    createAppointment(data, patientId, token);
  };

  return (
    <Container>
      <Title>Agendamento</Title>
      <Form onSubmit={handleSubmit(handleForm)}>
        <div>
          <Input
            label="Título"
            name="title"
            register={register}
            error={errors.title?.message}
          />
        </div>
        <div>
          <Input
            label="Início"
            name="start"
            type="datetime-local"
            register={register}
            error={errors.start?.message}
          />
        </div>
        <div>
          <Input
            label="Fim"
            name="end"
            type="datetime-local"
            register={register}
            error={errors.end?.message}
          />
        </div>
        <Button
          onClick={() => setIsOpenModal(!isOpenModal)}
          className="createtBtn"
          type="submit"
        >
          Enviar
        </Button>
      </Form>
    </Container>
  );
};

export default ScheduleForm;
