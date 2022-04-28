import { createElement, createOnsElement } from "../../utils/dom";
{
  /* 
<div class="product-header">
    <ons-progress-bar class="progress-bar progress-bar--indeterminate progress-bar--material" indeterminate="true" modifier="material indeterminate" style="display: none;">
        <div class="progress-bar">
            <div class="progress-bar__secondary progress-bar--material__secondary progress-bar--indeterminate__secondary" style="width: 0%;"></div>
            <div class="progress-bar__primary progress-bar--material__primary progress-bar--indeterminate__primary" style="width: 0%;"></div>
        </div>
    </ons-progress-bar>
</div> */
}

export default function progressbar() {
  const progressbar = createOnsElement(
    "<ons-progress-bar></ons-progress-bar>",
    [],
    {
      indeterminate: true,
      modifier: "material indeterminate",
    }
  );
  const progressbarWrapper = createElement("div", ["page-progress-bar"]);
  progressbarWrapper.append(progressbar);
  progressbarWrapper.show = () => progressbarWrapper.classList.remove("hide");
  progressbarWrapper.hide = () => progressbarWrapper.classList.add("hide");
  return progressbarWrapper;
}
