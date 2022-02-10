import { useDispatch, useSelector } from "react-redux";
import { currencyFormat } from "../../utils/format";
import api from "../../services/api";
import { cleanCart } from "../../redux/slicer/cartSlicer";
import { useNavigate } from "react-router";
import { Card, Info, Title, Value } from "./styles";
import { GoBackLink } from "../Produto/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { notification } from 'antd';
import Button from "../../components/Button";

const Checkout = () => {
  const { user, cart } = useSelector((state) => ({
    cart: state.cart,
    user: state.user,
  }));
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setTotal(
      cart.produtos.reduce(
        (prev, actual) => prev + actual.qtd * actual.precoUnit,
        0
      )
    );
  }, [cart]);

  const handleComprar = () => {
    api
      .comprar({
        userId: user.id,
        cartaoId: cart.cartaoEscolhido.id,
        enderecoId: cart.enderecoEscolhido.id,
        produtos: cart.produtos.map((prod) => ({
          produtoId: prod.id,
          quantidade: prod.qtd,
          precoUnit: prod.precoUnit,
        })),
      })
      .then((resp) => {
        const args = {
          message: 'OBRIGADO',
          description:
            'Compra realizada com sucesso!',
          duration: 2,
        };
        notification.success(args);
        dispatch(cleanCart());
        navigate("/");
      })
      .catch((err) => {
        const args = {
          message: 'Oops...',
          description:
            'Erro ao finalizar compra.',
          duration: 2,
        };
        notification.error(args);
      });
  };

  return (
    <div className="container">
      <GoBackLink to="/enderecos">
        <FontAwesomeIcon icon={faArrowLeft} /> Voltar aos endereços
      </GoBackLink>

      <div className="d-flex justify-content-center">
        <Title>Confirmar Compra</Title>
      </div>

      <div className="d-flex flex-row">
        <Card className="card" style={{ width: "60%" }}>
          <h3>Produtos</h3>
          {cart.produtos.map((prod) => (
            <div
              className="d-flex flex-row justify-content-between p-2"
              key={prod.id}
            >
              <Info>
                {prod.qtd}x {prod.nome}
              </Info>
              <Value bold>{currencyFormat(prod.qtd * prod.precoUnit)}</Value>
            </div>
          ))}

          <hr />

          <div className="mt-3 mb-3 d-flex  flex-row justify-content-between">
            <Info>Taxa de Entrega:</Info>
            <Value bold style={{ color: "green" }}>
              Grátis
            </Value>
          </div>

          <hr />

          <div className="mt-3 mb-3 d-flex  flex-row justify-content-between">
            <Info>Cartão:</Info>
            <Value bold style={{ color: "green" }}>
              {cart.cartaoEscolhido?.apelido}
            </Value>
          </div>

          <hr />

          <div className="mt-3 mb-3 d-flex align-items-center flex-row justify-content-between">
            <Info style={{ color: "#2f2f2f" }}>Valor total:</Info>
            <Value bold style={{ fontSize: 32 }}>
              {currencyFormat(total)}
            </Value>
          </div>
          <Button.Secondary onClick={handleComprar}>Finalizar Compra</Button.Secondary>
        </Card>

        <Card className="card" style={{ width: "40%", height: "50%" }}>
          <h3>Entrega</h3>
          <Info>
            {cart.enderecoEscolhido?.logradouro},{" "}
            {cart.enderecoEscolhido?.bairro} - {cart.enderecoEscolhido?.numero}
          </Info>
          <Info>
            {cart.enderecoEscolhido?.cidade} - {cart.enderecoEscolhido?.uf}
          </Info>
          <Info>CEP: {cart.enderecoEscolhido?.cep}</Info>

          <hr />

          <Value>Previsão de entrega até semana que vem</Value>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;