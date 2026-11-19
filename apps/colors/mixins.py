class SafeCreatedByMixin:
    """
    Passes `created_by` to serializer.save() only when the model has that
    field. Models such as ColorFamily and ColorFormulaIngredient don't, and
    passing it raises:
        TypeError: ... got unexpected keyword arguments: 'created_by'
    """

    def save_with_creator(self, serializer):
        model = serializer.Meta.model
        has_created_by = any(
            field.name == "created_by" for field in model._meta.get_fields()
        )

        if has_created_by:
            return serializer.save(created_by=self.request.user)

        return serializer.save()