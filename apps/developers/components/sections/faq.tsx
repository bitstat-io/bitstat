export default function FAQ() {
  return (
    <section>
      <h3 className="text-2xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="text-left">
          <h4 className="font-semibold mb-2">
            How quickly can I integrate GameVault?
          </h4>
          <p className="text-muted-foreground text-sm">
            Most developers complete integration in under 10 minutes using our
            SDK and comprehensive documentation.
          </p>
        </div>
        <div className="text-left">
          <h4 className="font-semibold mb-2">Do you offer a free trial?</h4>
          <p className="text-muted-foreground text-sm">
            Yes, all plans come with a 14-day free trial with full access to
            features. No credit card required.
          </p>
        </div>
        <div className="text-left">
          <h4 className="font-semibold mb-2">
            What about data privacy and security?
          </h4>
          <p className="text-muted-foreground text-sm">
            We&apos;re SOC2 compliant with bank-grade encryption. Your player
            data is secure and never shared with third parties.
          </p>
        </div>
        <div className="text-left">
          <h4 className="font-semibold mb-2">
            Can I upgrade as my game grows?
          </h4>
          <p className="text-muted-foreground text-sm">
            You can upgrade your plan at any time as your monthly active users
            increase.
          </p>
        </div>
      </div>
    </section>
  );
}
