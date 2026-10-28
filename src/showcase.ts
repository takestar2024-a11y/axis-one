const base = import.meta.env.BASE_URL;

// Banner artwork placed alongside the matching LP sections. The text is
// baked into each image, so the alt text repeats it for screen readers.
export const showcase = {
  strategy: {
    src: `${base}showcase/1.webp`,
    width: 756,
    height: 501,
    alt: "守るのは、あなたのビジネスと未来。AI時代のセキュリティ戦略を、すべての企業に。サイバー脅威から、大切なデータ・人・ビジネスを守る。",
  },
  threats: {
    src: `${base}showcase/2.webp`,
    width: 756,
    height: 501,
    alt: "見えない脅威から、あなたの大切なものを守る。最新の脅威に対応した総合セキュリティ対策。脅威の検知・防御、クラウドセキュリティ、データ保護、エンドポイント対策。",
  },
  investment: {
    src: `${base}showcase/3.webp`,
    width: 495,
    height: 500,
    alt: "セキュリティは、コストではなく「投資」です。企業の成長を支えるセキュリティサービス。",
  },
  confidence: {
    src: `${base}showcase/4.webp`,
    width: 499,
    height: 500,
    alt: "守るだけじゃない。「安心」が、ビジネスの力になる。",
  },
  consult: {
    src: `${base}showcase/5.webp`,
    width: 493,
    height: 500,
    alt: "確かな技術と、信頼できるパートナーとともに。あなたのビジネスに最適なセキュリティを。無料相談はこちら。",
  },
};
