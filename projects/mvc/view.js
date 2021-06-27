const Handlebars = window.Handlebars;

window.View = {
  render(templateName, model) {
    // имя шаблона,данные
    templateName = templateName + 'Template';

    const templateElement = document.getElementById(templateName);
    const templateSource = templateElement.innerHTML;
    const renderFn = Handlebars.compile(templateSource);

    return renderFn(model);
  },
};
